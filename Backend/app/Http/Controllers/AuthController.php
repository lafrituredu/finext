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
        $this->normalizeIdentityDocumentInput($request, 'dni');
        $googleProfile = null;
        $googleSetupUser = null;

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

            if ($googleSetupUser) {
                $googleSetupUser->forceFill($userData)->save();
                $user = $googleSetupUser->fresh();
            } else {
                $user = User::create($userData);
            }

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

        $token = $user->createToken('auth_token')->plainTextToken;

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

        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Debes verificar tu correo antes de iniciar sesión.',
                'code' => 'EMAIL_NOT_VERIFIED',
                'email' => $user->email,
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login correcto',
            'user' => $this->withAvatarUrl($user),
            'token' => $token
        ]);
    }

    public function redirectToGoogle()
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect');

        if (!$clientId || !$clientSecret || !$redirectUri) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no esta configurado en el servidor.',
            ]));
        }

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
        if ($request->filled('error')) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido completar el acceso con Google.',
            ]));
        }

        if (!$this->isValidGoogleState((string) $request->query('state', ''))) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'La sesion de Google ha caducado. Intentalo de nuevo.',
            ]));
        }

        $code = (string) $request->query('code', '');
        if ($code === '') {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no ha devuelto un codigo de autorizacion.',
            ]));
        }

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

        if ($tokenResponse->failed()) {
            report(new \RuntimeException('Google token exchange failed: ' . $tokenResponse->body()));

            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido validar tu cuenta de Google.',
            ]));
        }

        $accessToken = data_get($tokenResponse->json(), 'access_token');
        if (!$accessToken) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no ha devuelto un token valido.',
            ]));
        }

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

        if ($profileResponse->failed()) {
            report(new \RuntimeException('Google profile request failed: ' . $profileResponse->body()));

            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'No se ha podido leer tu perfil de Google.',
            ]));
        }

        $googleUser = $profileResponse->json();
        $googleId = (string) data_get($googleUser, 'sub', '');
        $email = Str::lower((string) data_get($googleUser, 'email', ''));
        $emailVerified = filter_var(data_get($googleUser, 'email_verified'), FILTER_VALIDATE_BOOLEAN);
        $name = trim((string) data_get($googleUser, 'name', ''));

        if ($googleId === '' || $email === '' || !$emailVerified) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'error' => 'Google no ha confirmado un email verificado.',
            ]));
        }

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

        if (!$user) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'google_setup_token' => $this->makeGoogleSetupToken($googleId, $email, $name),
                'email' => $email,
                'full_name' => $name !== '' ? $name : Str::before($email, '@'),
                'username' => $this->uniqueUsernameFromEmail($email),
            ]));
        }

        if ($this->needsGoogleOnboarding($user)) {
            return redirect()->away($this->googleFrontendCallbackUrl([
                'google_setup_token' => $this->makeGoogleSetupToken($googleId, $email, $name),
                'email' => $user->email,
                'full_name' => $name !== '' ? $name : $user->full_name,
                'username' => $user->username,
            ]));
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return redirect()->away($this->googleFrontendCallbackUrl([
            'token' => $token,
            'username' => $user->username,
            'email' => $user->email,
        ]));
    }

    public function verifyEmail(Request $request, int $id, string $hash)
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'https://finext.cat'), '/');

        if (!URL::hasValidSignature($request)) {
            return redirect()->away($frontendUrl . '/verify-email?status=invalid');
        }

        $user = User::find($id);

        if (!$user || !hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->away($frontendUrl . '/verify-email?status=invalid');
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect()->away(
            $frontendUrl . '/verify-email?status=success&email=' . urlencode($user->email)
        );
    }

    public function resendVerificationEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'locale' => 'nullable|in:en,es',
        ]);

        $locale = $this->mailLocale($request->input('locale'));
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No hemos encontrado ninguna cuenta con ese correo.',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Ese correo ya está verificado.',
                'already_verified' => true,
            ]);
        }

        app()->terminating(function () use ($user, $locale) {
            $this->sendVerificationEmail($user, $locale);
        });

        return response()->json([
            'message' => 'Te hemos reenviado el correo de verificación.',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'locale' => 'nullable|in:en,es',
        ]);

        $locale = $this->mailLocale($request->input('locale'));
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No hemos podido enviar el correo de recuperacion a esa direccion.',
            ], 422);
        }

        $token = Password::broker()->createToken($user);

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

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();
                event(new PasswordReset($user));
            }
        );

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
        $user = $request->user()->load(['autonomo']);

        return response()->json($this->withAvatarUrl($user));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $phoneFormatMessage = 'El numero de telefono no puede tener ese formato.';
        $user->loadMissing('autonomo');

        if ($request->has('phone_number') && is_string($request->input('phone_number'))) {
            $request->merge([
                'phone_number' => preg_replace('/[\s().-]+/', '', trim($request->input('phone_number'))),
            ]);
        }

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
            'irpf' => [Rule::requiredIf($user->rol === 'autonomo'), 'nullable', 'numeric', 'min:0', 'max:100'],
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

        $data['username'] = trim($data['username']);
        $data['full_name'] = preg_replace('/\s+/', ' ', trim($data['full_name']));

        if (isset($data['company'])) {
            $data['company'] = preg_replace('/\s+/', ' ', trim($data['company']));
        }

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
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store("avatars/{$user->id}", 'public');
        $user->update(['avatar' => $path]);

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo'])));
    }

    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo'])));
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        $avatar = $user->avatar;
        $email = $user->email;

        DB::transaction(function () use ($user, $email) {
            $user->tokens()->delete();
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            DB::table('sessions')->where('user_id', $user->id)->delete();
            $user->delete();
        });

        if ($avatar) {
            Storage::disk('public')->delete($avatar);
        }

        return response()->json([
            'message' => 'Cuenta eliminada correctamente'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout correcto'
        ]);
    }

    private function withAvatarUrl(User $user): User
    {
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
        if (!$request->has($field) || !is_string($request->input($field))) {
            return;
        }

        $request->merge([
            $field => $this->normalizeIdentityDocument($request->input($field)),
        ]);
    }

    private function normalizeIdentityDocument(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return strtoupper((string) preg_replace('/\s+/', '', trim($value)));
    }

    private function validUniqueSpanishDniNieRule(?int $ignoreUserId = null): \Closure
    {
        return function ($attribute, $value, $fail) use ($ignoreUserId): void {
            if ($value === null || $value === '') {
                return;
            }

            if (!$this->isValidSpanishDniNie((string) $value)) {
                $fail('El DNI o NIE no tiene un formato valido.');
                return;
            }

            $query = Autonomo::where('dni', $this->hashIdentityDocument((string) $value));

            if ($ignoreUserId !== null) {
                $query->where('user_id', '!=', $ignoreUserId);
            }

            if ($query->exists()) {
                $fail('El DNI o NIE ya esta registrado.');
            }
        };
    }

    private function hashIdentityDocument(string $value): string
    {
        return hash_hmac(
            'sha256',
            $this->normalizeIdentityDocument($value) ?? '',
            (string) config('app.key')
        );
    }

    private function isValidSpanishDniNie(string $value): bool
    {
        $normalizedValue = $this->normalizeIdentityDocument($value) ?? '';

        if ($this->hasSuspiciousIdentityNumber($normalizedValue)) {
            return false;
        }

        if (preg_match('/^(\d{8})([A-Z])$/', $normalizedValue, $matches)) {
            return $this->expectedIdentityLetter($matches[1]) === $matches[2];
        }

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
        $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

        return $letters[((int) $numbers) % 23];
    }

    private function hasSuspiciousIdentityNumber(string $normalizedValue): bool
    {
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

        return preg_match('/^(\d)\1+$/', $numbers) === 1
            || str_contains('0123456789', $numbers)
            || str_contains('9876543210', $numbers);
    }

    private function uniqueUsernameFromEmail(string $email): string
    {
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

        while (User::where('username', $username)->exists()) {
            $suffix = '_' . $counter;
            $username = Str::limit($base, 30 - strlen($suffix), '') . $suffix;
            $counter++;
        }

        return $username;
    }

    private function googleHttp(): PendingRequest
    {
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
        return $user->google_id !== null && (
            empty($user->phone_number) ||
            empty($user->full_name)
        );
    }

    private function makeGoogleSetupToken(string $googleId, string $email, string $name): string
    {
        $payload = $this->base64UrlEncode(json_encode([
            'google_id' => $googleId,
            'email' => $email,
            'name' => $name,
            'iat' => now()->timestamp,
        ], JSON_THROW_ON_ERROR));

        return $payload . '.' . $this->googleSetupSignature($payload);
    }

    private function decodeGoogleSetupToken(string $token): ?array
    {
        [$payload, $signature] = array_pad(explode('.', $token, 2), 2, null);

        if (!$payload || !$signature || !hash_equals($this->googleSetupSignature($payload), $signature)) {
            return null;
        }

        $decoded = json_decode($this->base64UrlDecode($payload), true);

        if (
            !is_array($decoded) ||
            empty($decoded['google_id']) ||
            empty($decoded['email']) ||
            !isset($decoded['iat'])
        ) {
            return null;
        }

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
        return hash_hmac('sha256', 'google_setup:' . $payload, (string) config('app.key'));
    }

    private function makeGoogleState(): string
    {
        $payload = $this->base64UrlEncode(json_encode([
            'nonce' => Str::random(40),
            'iat' => now()->timestamp,
        ], JSON_THROW_ON_ERROR));

        return $payload . '.' . $this->googleStateSignature($payload);
    }

    private function isValidGoogleState(string $state): bool
    {
        [$payload, $signature] = array_pad(explode('.', $state, 2), 2, null);

        if (!$payload || !$signature || !hash_equals($this->googleStateSignature($payload), $signature)) {
            return false;
        }

        $decoded = json_decode($this->base64UrlDecode($payload), true);

        if (!is_array($decoded) || !isset($decoded['iat'])) {
            return false;
        }

        return now()->timestamp - (int) $decoded['iat'] <= 600;
    }

    private function googleStateSignature(string $payload): string
    {
        return hash_hmac('sha256', $payload, (string) config('app.key'));
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }

    private function googleFrontendCallbackUrl(array $query): string
    {
        $callbackUrl = (string) config('services.google.frontend_redirect');
        $separator = str_contains($callbackUrl, '?') ? '&' : '?';

        return $callbackUrl . $separator . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
    }

    private function sendVerificationEmail(User $user, string $locale): bool
    {
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
        $token = config('services.mailtrap.api_token');
        $endpoint = config('services.mailtrap.api_endpoint');

        if (!$token || !$endpoint || !$templateUuid) {
            report(new \RuntimeException('Mailtrap template configuration is incomplete.'));
            return false;
        }

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

        if ($response->failed()) {
            report(new \RuntimeException('Mailtrap template email failed: ' . $response->body()));
            return false;
        }

        return true;
    }

    private function verificationUrl(User $user): string
    {
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
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');

        return $frontendUrl
            . '/reset-password?token=' . urlencode($token)
            . '&email=' . urlencode($user->getEmailForPasswordReset());
    }

    private function mailLocale(?string $locale): string
    {
        return $locale === 'es' ? 'es' : 'en';
    }
}
