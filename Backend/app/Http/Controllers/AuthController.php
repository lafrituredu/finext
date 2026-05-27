<?php

namespace App\Http\Controllers;

use App\Models\Autonomo;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        // Normalize DNI/NIE before validation so we always compare the same format.
        $this->normalizeIdentityDocumentInput($request, 'dni');
        $googleProfile = null;
        $googleSetupUser = null;

        // If the register comes from Google, the temporary token confirms that
        // Google already checked the user email and basic identity.
        if ($request->filled('google_setup_token')) {
            $googleProfile = $this->decodeGoogleSetupToken((string) $request->input('google_setup_token'));

            if (!$googleProfile) {
                return response()->json([
                    'message' => 'La sesion de Google ha caducado. Vuelve a intentarlo.',
                ], 422);
            }

            $request->merge([
                'email' => $googleProfile['email'],
                'username' => $request->input('username') ?: $this->uniqueUsernameFromEmail($googleProfile['email']),
            ]);

            $googleSetupUser = User::where('google_id', $googleProfile['google_id'])
                ->orWhere('email', $googleProfile['email'])
                ->first();
        }

        $passwordRules = $googleProfile
            ? ['nullable']
            : [
                'required',
                'min:8',
                'regex:/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/'
            ];

        // Validate the data that comes from Register.tsx.
        // Tax fields are only required when rol is autonomo.
        $request->validate([
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($googleSetupUser?->id),
            ],
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($googleSetupUser?->id),
            ],
            'password' => $passwordRules,
            'google_setup_token' => 'nullable|string',
            'rol' => 'required|in:particular,autonomo',
            'dni' => [
                'required_if:rol,autonomo',
                'nullable',
                'string',
                'max:255',
                $this->validUniqueSpanishDniNieRule(),
            ],
            'birthdate' => 'required_if:rol,autonomo|nullable|date',
            'modulo_iva' => 'nullable|numeric|min:0|max:100',
            'estado_civil' => 'nullable|in:soltero,casado,divorciado,separado,viudo,pareja_de_hecho',
            'empresa' => 'required_if:rol,autonomo|nullable|string|max:255',
            'irpf' => 'nullable|numeric|min:0|max:100',
            'locale' => 'nullable|in:en,es',
        ]);

        $locale = $this->mailLocale($request->input('locale'));

        // User and Autonomo are created inside a database transaction.
        // If something fails, we do not keep an incomplete user.
        $user = DB::transaction(function () use ($request, $googleProfile, $googleSetupUser) {
            $userData = [
                'username' => $request->username,
                'full_name' => $request->full_name,
                'phone_number' => $request->phone_number,
                'rol' => $request->rol,
                'email' => $request->email,
                'email_verified_at' => $googleProfile ? now() : null,
                'google_id' => $googleProfile['google_id'] ?? null,
                'password' => Hash::make($googleProfile ? Str::random(40) : $request->password),
            ];

            // During Google onboarding, a partial user can already exist.
            // In that case, update it instead of creating a duplicate.
            if ($googleSetupUser) {
                $googleSetupUser->forceFill($userData)->save();
                $user = $googleSetupUser->fresh();
            } else {
                $user = User::create($userData);
            }

            // The Autonomo model stores tax data and is connected by user_id.
            if ($request->rol === 'autonomo') {
                Autonomo::create([
                    'user_id' => $user->id,
                    'dni' => $this->hashIdentityDocument($request->dni),
                    'birth_date' => $request->birthdate,
                    'modulo_iva' => $request->modulo_iva,
                    'civil_state' => $request->estado_civil,
                    'company' => $request->empresa,
                    'irpf' => $request->irpf,
                ]);
            }

            return $user;
        });

        // Sanctum creates the API token used by the frontend as a Bearer token.
        $token = $user->createToken('auth_token')->plainTextToken;

        // Normal register sends a verification email.
        // Google already gives a verified email, so it does not need this step.
        if (!$googleProfile) {
            app()->terminating(function () use ($user, $locale) {
                $this->sendVerificationEmail($user, $locale);
            });
        }

        return response()->json([
            'message' => $googleProfile
                ? 'Registro con Google completado correctamente.'
                : 'Te hemos enviado un correo para verificar tu cuenta.',
            'user' => $googleProfile
                ? $this->withAvatarUrl($user->fresh()->load(['autonomo']))
                : $user->only(['id', 'username', 'email']),
            'token' => $token,
            'requires_verification' => !$googleProfile,
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        // Login only accepts email and password.
        // The password is never compared as plain text.
        // It is checked against the hash saved in users.password.
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', Str::lower(trim($request->email)))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Even if the credentials are correct, the user cannot enter
        // until email_verified_at has a value.
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Debes verificar tu correo antes de iniciar sesión.',
                'code' => 'EMAIL_NOT_VERIFIED',
                'email' => $user->email,
            ], 403);
        }

        // Each login creates a new token.
        // Logout will delete only the current token.
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login correcto',
            'user' => $this->withAvatarUrl($user),
            'token' => $token
        ]);
    }

    public function redirectToGoogle()
    {
        // Read the Google OAuth configuration from config/services.php.
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect');

        // If Google is not configured, send the user back to the frontend with an error.
        if (!$clientId || !$clientSecret || !$redirectUri) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no esta configurado en el servidor.',
            ]));
        }

        // Build the Google authorization URL.
        // Google will redirect back to our callback with a temporary code.
        $query = http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'online',
            'prompt' => 'select_account',
            'state' => $this->makeGoogleState(),
        ], '', '&', PHP_QUERY_RFC3986);

        return redirect()->away('https://accounts.google.com/o/oauth2/v2/auth?' . $query);
    }

    public function handleGoogleCallback(Request $request)
    {
        // If Google sends an error, return it to the frontend.
        if ($request->filled('error')) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido completar el acceso con Google.',
            ]));
        }

        // Check the state value to protect the Google login flow.
        if (!$this->isValidGoogleState((string) $request->query('state', ''))) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'La sesion de Google ha caducado. Intentalo de nuevo.',
            ]));
        }

        // Google sends a temporary code.
        // Laravel exchanges it for an access token and then asks Google for the profile.
        $code = (string) $request->query('code', '');
        if ($code === '') {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no ha devuelto un codigo de autorizacion.',
            ]));
        }

        // Exchange the Google code for an access token.
        try {
            $tokenResponse = $this->googleHttp()->asForm()->post('https://oauth2.googleapis.com/token', [
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'code' => $code,
                'grant_type' => 'authorization_code',
                'redirect_uri' => config('services.google.redirect'),
            ]);
        } catch (ConnectionException $exception) {
            report($exception);

            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido conectar con Google. Revisa tu conexion o proxy local.',
            ]));
        }

        // If the token request fails, the login cannot continue.
        if ($tokenResponse->failed()) {
            report(new \RuntimeException('Google token exchange failed: ' . $tokenResponse->body()));

            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido validar tu cuenta de Google.',
            ]));
        }

        // Read the access token from Google's response.
        $accessToken = data_get($tokenResponse->json(), 'access_token');
        if (!$accessToken) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no ha devuelto un token valido.',
            ]));
        }

        // Use the access token to get the real Google user profile.
        try {
            $profileResponse = $this->googleHttp()
                ->withToken($accessToken)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');
        } catch (ConnectionException $exception) {
            report($exception);

            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido leer tu perfil de Google. Revisa tu conexion o proxy local.',
            ]));
        }

        // If the profile request fails, return an error to the frontend.
        if ($profileResponse->failed()) {
            report(new \RuntimeException('Google profile request failed: ' . $profileResponse->body()));

            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido leer tu perfil de Google.',
            ]));
        }

        // Read the important profile values from Google.
        $googleUser = $profileResponse->json();
        $googleId = (string) data_get($googleUser, 'sub', '');
        $email = Str::lower((string) data_get($googleUser, 'email', ''));
        $emailVerified = filter_var(data_get($googleUser, 'email_verified'), FILTER_VALIDATE_BOOLEAN);
        $name = trim((string) data_get($googleUser, 'name', ''));

        // The app only accepts Google users with a verified email.
        if ($googleId === '' || $email === '' || !$emailVerified) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no ha confirmado un email verificado.',
            ]));
        }

        // If the user already exists, connect the Google id and verify the email.
        $user = DB::transaction(function () use ($googleId, $email, $name) {
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if ($user) {
                $updates = ['google_id' => $googleId];

                if (!$user->hasVerifiedEmail()) {
                    $updates['email_verified_at'] = now();
                }

                if (!$user->full_name && $name !== '') {
                    $updates['full_name'] = $name;
                }

                $user->forceFill($updates)->save();

                return $user->fresh();
            }
            return null;
        });

        // If the user does not exist, do not create it yet.
        // Send a temporary token to the frontend to finish the Finext register.
        if (!$user) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'google_setup_token' => $this->makeGoogleSetupToken($googleId, $email, $name),
                'email' => $email,
                'full_name' => $name !== '' ? $name : Str::before($email, '@'),
                'username' => $this->uniqueUsernameFromEmail($email),
            ]));
        }

        // If the user exists but is missing required Finext data,
        // send them to onboarding before giving the final token.
        if ($this->needsGoogleOnboarding($user)) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'google_setup_token' => $this->makeGoogleSetupToken($googleId, $email, $name),
                'email' => $user->email,
                'full_name' => $name !== '' ? $name : $user->full_name,
                'username' => $user->username,
            ]));
        }

        // Complete Google user: create a Sanctum token and send it to React.
        $token = $user->createToken('auth_token')->plainTextToken;
        return redirect()->away($this->googleFrontendCallbackUrl([
            'token' => $token,
            'username' => $user->username,
            'email' => $user->email,
        ]));
    }

    public function verifyEmail(Request $request, int $id, string $hash)
    {
        // This is the frontend page where the user will see the result.
        $frontendUrl = rtrim(env('FRONTEND_URL', 'https://finext.cat'), '/');

        // The verification link must have a valid temporary signature.
        if (!URL::hasValidSignature($request)) {
            return redirect()->away($frontendUrl . '/verify-email?status=invalid');
        }

        // Find the user and check that the email hash belongs to that user.
        $user = User::find($id);

        if (!$user || !hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->away($frontendUrl . '/verify-email?status=invalid');
        }

        // Mark the email as verified only if it was not verified before.
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect()->away(
            $frontendUrl . '/verify-email?status=success&email=' . urlencode($user->email)
        );
    }

    public function resendVerificationEmail(Request $request)
    {
        // Validate the email and the optional language.
        $request->validate([
            'email' => 'required|email',
            'locale' => 'nullable|in:en,es',
        ]);

        // Find the user that wants a new verification email.
        $locale = $this->mailLocale($request->input('locale'));
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No hemos encontrado ninguna cuenta con ese correo.',
            ], 404);
        }

        // Do not resend the email if the account is already verified.
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Ese correo ya está verificado.',
                'already_verified' => true,
            ]);
        }

        // Send the email after the response is finished.
        app()->terminating(function () use ($user, $locale) {
            $this->sendVerificationEmail($user, $locale);
        });

        return response()->json([
            'message' => 'Te hemos reenviado el correo de verificación.',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        // Validate the email and the optional language.
        $request->validate([
            'email' => 'required|email',
            'locale' => 'nullable|in:en,es',
        ]);

        // Find the user and create a password reset token.
        $locale = $this->mailLocale($request->input('locale'));
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No hemos podido enviar el correo de recuperacion a esa direccion.',
            ], 422);
        }

        $token = Password::broker()->createToken($user);

        // Send the reset email using the Mailtrap template.
        if (!$this->sendPasswordResetEmail($user, $token, $locale)) {
            return response()->json([
                'message' => 'No hemos podido enviar el correo de recuperacion a esa direccion.',
            ], 500);
        }

        return response()->json([
            'message' => 'Te hemos enviado un correo para restablecer tu contrasena.',
        ]);
    }
    public function resetPassword(Request $request)
    {
        // Validate the reset token, email, and new confirmed password.
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/'
            ],
        ]);

        // Reset the password using Laravel's password broker.
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Delete all API tokens so old sessions cannot keep using the account.
                $user->tokens()->delete();
                event(new PasswordReset($user));
            }
        );

        // If the token is invalid or expired, return an error.
        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'El enlace de recuperación no es válido o ya ha caducado.',
            ], 422);
        }

        return response()->json([
            'message' => 'Tu contraseña se ha actualizado correctamente.',
        ]);
    }

    public function checkEmail(Request $request)
    {
        // Check if an email is already used by another account.
        $email = $request->query('email');

        if (!$email) {
            return response()->json([
                'available' => false,
                'message' => 'Email is required'
            ], 400);
        }

        $exists = User::where('email', $email)->exists();

        return response()->json([
            'available' => !$exists
        ]);
    }

    public function checkUsername(Request $request)
    {
        // Check if a username is already used by another account.
        $username = $request->query('username');

        if (!$username) {
            return response()->json([
                'available' => false,
                'message' => 'Username is required'
            ], 400);
        }

        $exists = User::where('username', $username)->exists();

        return response()->json([
            'available' => !$exists
        ]);
    }

    public function me(Request $request)
    {
        // auth:sanctum already found the user using the Bearer token.
        // Here we only return the profile and the autonomo relation if it exists.
        $user = $request->user()->load(['autonomo']);

        return response()->json($this->withAvatarUrl($user));
    }

    public function currentUserRole(Request $request)
    {
        // Return only the role of the logged user.
        // This is useful when the frontend needs to show or hide fields.
        return response()->json([
            'rol' => $request->user()->rol,
        ]);
    }

    public function updateProfile(Request $request)
    {
        // Update the profile of the logged user.
        $user = $request->user();
        $phoneFormatMessage = 'El numero de telefono no puede tener ese formato.';
        $user->loadMissing('autonomo');

        // Remove spaces and common symbols from the phone number before validation.
        if ($request->has('phone_number') && is_string($request->input('phone_number'))) {
            $request->merge([
                'phone_number' => preg_replace('/[\s().-]+/', '', trim($request->input('phone_number'))),
            ]);
        }

        // Validate normal user fields and autonomo fields when needed.
        $data = $request->validate([
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'full_name' => 'required|string|max:255',
            'phone_number' => [
                'required',
                'string',
                'max:16',
                'regex:/^\+?\d{7,15}$/',
            ],
            'birth_date' => [Rule::requiredIf($user->rol === 'autonomo'), 'nullable', 'date'],
            'modulo_iva' => [Rule::requiredIf($user->rol === 'autonomo'), 'nullable', 'numeric', 'min:0', 'max:100'],
            'civil_state' => [Rule::requiredIf($user->rol === 'autonomo'), 'nullable', 'in:soltero,casado,divorciado,separado,viudo,pareja_de_hecho'],
            'company' => [Rule::requiredIf($user->rol === 'autonomo'), 'nullable', 'string', 'max:255'],
            'irpf' => [Rule::requiredIf($user->rol === 'autonomo'), 'nullable', 'numeric', 'min:0', 'max:60'],
        ], [
            'phone_number.required' => 'El telefono es obligatorio.',
            'phone_number.regex' => $phoneFormatMessage,
            'phone_number.max' => $phoneFormatMessage,
            'birth_date.required' => 'La fecha de nacimiento es obligatoria.',
            'modulo_iva.required' => 'Selecciona un tipo de IVA.',
            'civil_state.required' => 'Selecciona un estado civil.',
            'company.required' => 'La empresa es obligatoria.',
            'irpf.required' => 'Selecciona un tipo de IRPF.',
        ]);

        // Clean extra spaces from text fields before saving.
        $data['username'] = trim($data['username']);
        $data['full_name'] = preg_replace('/\s+/', ' ', trim($data['full_name']));

        if (isset($data['company'])) {
            $data['company'] = preg_replace('/\s+/', ' ', trim($data['company']));
        }

        // Update user data and autonomo data in the same database transaction.
        DB::transaction(function () use ($user, $data) {
            $user->update([
                'username' => $data['username'],
                'full_name' => $data['full_name'],
                'phone_number' => $data['phone_number'],
            ]);

            if ($user->rol === 'autonomo') {
                Autonomo::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'birth_date' => $data['birth_date'] ?? null,
                        'modulo_iva' => $data['modulo_iva'] ?? null,
                        'civil_state' => $data['civil_state'] ?? null,
                        'company' => $data['company'],
                        'irpf' => $data['irpf'] ?? null,
                    ]
                );
            }
        });

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo'])));
    }

    public function updateAvatar(Request $request)
    {
        // Validate the uploaded avatar image.
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $request->user();

        // Delete the old avatar before saving the new one.
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store the new avatar in the public disk.
        $path = $request->file('avatar')->store("avatars/{$user->id}", 'public');
        $user->update(['avatar' => $path]);

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo'])));
    }

    public function deleteAvatar(Request $request)
    {
        // Delete the avatar file and remove the path from the user.
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo'])));
    }

    public function deleteAccount(Request $request)
    {
        // Delete the logged user's account and related session data.
        $user = $request->user();
        $avatar = $user->avatar;
        $email = $user->email;

        // Delete tokens, reset tokens, sessions, and the user inside one transaction.
        DB::transaction(function () use ($user, $email) {
            $user->tokens()->delete();
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            DB::table('sessions')->where('user_id', $user->id)->delete();
            $user->delete();
        });

        // Delete the avatar file after the database data is removed.
        if ($avatar) {
            Storage::disk('public')->delete($avatar);
        }

        return response()->json([
            'message' => 'Cuenta eliminada correctamente'
        ]);
    }

    public function logout(Request $request)
    {
        // Delete only the token used in this request.
        // Other devices can keep their tokens until they are deleted or expire.
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout correcto'
        ]);
    }

    private function withAvatarUrl(User $user): User
    {
        // The API returns a ready-to-use avatar URL.
        // If the user is autonomo, never return the real DNI.
        // Only say if the DNI is saved or not.
        $user->setAttribute(
            'avatar_url',
            $user->avatar ? Storage::disk('public')->url($user->avatar) : null
        );

        if ($user->relationLoaded('autonomo') && $user->autonomo) {
            $user->autonomo->setAttribute('dni_set', !empty($user->autonomo->dni));
            $user->autonomo->setAttribute('dni', null);
        }

        return $user;
    }

    private function normalizeIdentityDocumentInput(Request $request, string $field): void
    {
        // If the request has this identity field, normalize it in the request itself.
        if (!$request->has($field) || !is_string($request->input($field))) {
            return;
        }

        $request->merge([
            $field => $this->normalizeIdentityDocument($request->input($field)),
        ]);
    }

    private function normalizeIdentityDocument(?string $value): ?string
    {
        // Return null when there is no value to normalize.
        if ($value === null) {
            return null;
        }

        // Remove spaces and convert letters to uppercase.
        return strtoupper((string) preg_replace('/\s+/', '', trim($value)));
    }

    private function validUniqueSpanishDniNieRule(?int $ignoreUserId = null): \Closure
    {
        // Return a custom validation rule for Spanish DNI/NIE.
        return function ($attribute, $value, $fail) use ($ignoreUserId): void {
            if ($value === null || $value === '') {
                return;
            }

            // First check that the DNI/NIE format and letter are correct.
            if (!$this->isValidSpanishDniNie((string) $value)) {
                $fail('El DNI o NIE no tiene un formato valido.');
                return;
            }

            // DNI/NIE is stored hashed, so we compare the hash.
            $query = Autonomo::where('dni', $this->hashIdentityDocument((string) $value));

            // When updating a user, ignore the current user's DNI/NIE.
            if ($ignoreUserId !== null) {
                $query->where('user_id', '!=', $ignoreUserId);
            }

            // If another user has the same DNI/NIE hash, validation fails.
            if ($query->exists()) {
                $fail('El DNI o NIE ya esta registrado.');
            }
        };
    }

    private function hashIdentityDocument(string $value): string
    {
        // Store DNI/NIE as a secure hash instead of plain text.
        return hash_hmac(
            'sha256',
            $this->normalizeIdentityDocument($value) ?? '',
            (string) config('app.key')
        );
    }

    private function isValidSpanishDniNie(string $value): bool
    {
        // Normalize the value before checking DNI/NIE rules.
        $normalizedValue = $this->normalizeIdentityDocument($value) ?? '';

        // Block fake or too simple identity numbers.
        if ($this->hasSuspiciousIdentityNumber($normalizedValue)) {
            return false;
        }

        // DNI format: 8 numbers and 1 letter.
        if (preg_match('/^(\d{8})([A-Z])$/', $normalizedValue, $matches)) {
            return $this->expectedIdentityLetter($matches[1]) === $matches[2];
        }

        // NIE format: X/Y/Z, 7 numbers, and 1 letter.
        if (preg_match('/^([XYZ])(\d{7})([A-Z])$/', $normalizedValue, $matches)) {
            $prefixMap = [
                'X' => '0',
                'Y' => '1',
                'Z' => '2',
            ];

            return $this->expectedIdentityLetter($prefixMap[$matches[1]] . $matches[2]) === $matches[3];
        }

        return false;
    }

    private function expectedIdentityLetter(string $numbers): string
    {
        // Spanish DNI/NIE uses this letter table.
        $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

        // The expected letter depends on the number modulo 23.
        return $letters[((int) $numbers) % 23];
    }

    private function hasSuspiciousIdentityNumber(string $normalizedValue): bool
    {
        // Some common fake DNI/NIE values are blocked directly.
        $blockedIdentityDocuments = [
            '00000000T',
            '00000001R',
            '11111111H',
            '12345678Z',
            '87654321X',
            'X0000000T',
            'Y0000000Z',
            'Z0000000M',
        ];

        if (in_array($normalizedValue, $blockedIdentityDocuments, true)) {
            return true;
        }

        if (!preg_match('/^[XYZ]?(\d+)[A-Z]$/', $normalizedValue, $matches)) {
            return false;
        }

        $numbers = $matches[1];

        // Block repeated numbers and simple ascending or descending sequences.
        return preg_match('/^(\d)\1+$/', $numbers) === 1
            || str_contains('0123456789', $numbers)
            || str_contains('9876543210', $numbers);
    }

    private function uniqueUsernameFromEmail(string $email): string
    {
        // Create a clean username using the part before the email at sign.
        $base = Str::of(Str::before($email, '@'))
            ->lower()
            ->replaceMatches('/[^a-z0-9_]+/', '_')
            ->trim('_')
            ->limit(30, '')
            ->value();

        if ($base === '') {
            $base = 'google_user';
        }

        $username = $base;
        $counter = 1;

        // If the username already exists, add a number until it is unique.
        while (User::where('username', $username)->exists()) {
            $suffix = '_' . $counter;
            $username = Str::limit($base, 30 - strlen($suffix), '') . $suffix;
            $counter++;
        }

        return $username;
    }

    private function googleHttp(): PendingRequest
    {
        // Create a Google HTTP client without local proxy settings.
        return Http::withOptions([
            'proxy' => '',
            'curl' => [
                CURLOPT_PROXY => '',
                CURLOPT_NOPROXY => '*',
            ],
        ])->timeout(10);
    }

    private function needsGoogleOnboarding(User $user): bool
    {
        // Google users need onboarding when required Finext fields are missing.
        return $user->google_id !== null && (
            empty($user->phone_number) ||
            empty($user->full_name)
        );
    }

    private function makeGoogleSetupToken(string $googleId, string $email, string $name): string
    {
        // Create a short-lived token with the Google data needed for onboarding.
        $payload = $this->base64UrlEncode(json_encode([
            'google_id' => $googleId,
            'email' => $email,
            'name' => $name,
            'iat' => now()->timestamp,
        ], JSON_THROW_ON_ERROR));

        // Add a signature so nobody can change the payload.
        return $payload . '.' . $this->googleSetupSignature($payload);
    }

    private function decodeGoogleSetupToken(string $token): ?array
    {
        // Split the token into payload and signature.
        [$payload, $signature] = array_pad(explode('.', $token, 2), 2, null);

        // If the signature is wrong, the token is not valid.
        if (!$payload || !$signature || !hash_equals($this->googleSetupSignature($payload), $signature)) {
            return null;
        }

        // Decode the payload and check the required fields.
        $decoded = json_decode($this->base64UrlDecode($payload), true);

        if (
            !is_array($decoded) ||
            empty($decoded['google_id']) ||
            empty($decoded['email']) ||
            !isset($decoded['iat'])
        ) {
            return null;
        }

        // The setup token expires after 15 minutes.
        if (now()->timestamp - (int) $decoded['iat'] > 900) {
            return null;
        }

        return [
            'google_id' => (string) $decoded['google_id'],
            'email' => Str::lower((string) $decoded['email']),
            'name' => (string) ($decoded['name'] ?? ''),
        ];
    }

    private function googleSetupSignature(string $payload): string
    {
        // Sign Google setup tokens using the app key.
        return hash_hmac('sha256', 'google_setup:' . $payload, (string) config('app.key'));
    }

    private function makeGoogleState(): string
    {
        // Create a temporary state value for Google OAuth.
        // It helps protect the login redirect flow.
        $payload = $this->base64UrlEncode(json_encode([
            'nonce' => Str::random(40),
            'iat' => now()->timestamp,
        ], JSON_THROW_ON_ERROR));

        return $payload . '.' . $this->googleStateSignature($payload);
    }

    private function isValidGoogleState(string $state): bool
    {
        // Split and validate the state signature.
        [$payload, $signature] = array_pad(explode('.', $state, 2), 2, null);

        if (!$payload || !$signature || !hash_equals($this->googleStateSignature($payload), $signature)) {
            return false;
        }

        // Decode the state and check that it has a creation time.
        $decoded = json_decode($this->base64UrlDecode($payload), true);

        if (!is_array($decoded) || !isset($decoded['iat'])) {
            return false;
        }

        // Google state expires after 10 minutes.
        return now()->timestamp - (int) $decoded['iat'] <= 600;
    }

    private function googleStateSignature(string $payload): string
    {
        // Sign the Google state using the app key.
        return hash_hmac('sha256', $payload, (string) config('app.key'));
    }

    private function base64UrlEncode(string $value): string
    {
        // Encode text in a URL-safe base64 format.
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        // Decode text from URL-safe base64 format.
        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }

    private function googleFrontendCallbackUrl(array $query): string
    {
        // Build the frontend callback URL with query parameters.
        $callbackUrl = (string) config('services.google.frontend_redirect');
        $separator = str_contains($callbackUrl, '?') ? '&' : '?';

        return $callbackUrl . $separator . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
    }

    private function sendVerificationEmail(User $user, string $locale): bool
    {
        // Send the email verification message with the correct language template.
        return $this->sendMailtrapTemplate(
            $user->email,
            $user->full_name,
            config("services.mailtrap.templates.email_verification.$locale"),
            [
                'name' => $user->full_name,
                'verification_url' => $this->verificationUrl($user),
            ]
        );
    }

    private function sendPasswordResetEmail(User $user, string $token, string $locale): bool
    {
        // Send the password reset message with the correct language template.
        return $this->sendMailtrapTemplate(
            $user->email,
            $user->full_name,
            config("services.mailtrap.templates.password_reset.$locale"),
            [
                'name' => $user->full_name,
                'reset_url' => $this->passwordResetUrl($user, $token),
                'expiration_minutes' => (string) config('auth.passwords.users.expire', 60),
            ]
        );
    }

    private function sendMailtrapTemplate(string $email, string $name, ?string $templateUuid, array $variables): bool
    {
        // Read Mailtrap configuration.
        $token = config('services.mailtrap.api_token');
        $endpoint = config('services.mailtrap.api_endpoint');

        // If the mail configuration is missing, report the error and stop.
        if (!$token || !$endpoint || !$templateUuid) {
            report(new \RuntimeException('Mailtrap template configuration is incomplete.'));
            return false;
        }

        // Send the email using Mailtrap template variables.
        $response = Http::withHeaders([
            'Api-Token' => $token,
        ])->post($endpoint, [
            'from' => [
                'email' => config('services.mailtrap.from_email'),
                'name' => config('services.mailtrap.from_name'),
            ],
            'to' => [
                ['email' => $email, 'name' => $name],
            ],
            'template_uuid' => $templateUuid,
            'template_variables' => $variables,
        ]);

        // Report Mailtrap errors so they can be checked in logs.
        if ($response->failed()) {
            report(new \RuntimeException('Mailtrap template email failed: ' . $response->body()));
            return false;
        }

        return true;
    }

    private function verificationUrl(User $user): string
    {
        // Create a temporary signed URL for email verification.
        return URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->getKey(),
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );
    }

    private function passwordResetUrl(User $user, string $token): string
    {
        // Create the frontend URL where the user will set the new password.
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');

        return $frontendUrl
            . '/reset-password?token=' . urlencode($token)
            . '&email=' . urlencode($user->getEmailForPasswordReset());
    }

    private function mailLocale(?string $locale): string
    {
        // Use Spanish only when the frontend asks for it.
        // Otherwise use English.
        return $locale === 'es' ? 'es' : 'en';
    }
}
