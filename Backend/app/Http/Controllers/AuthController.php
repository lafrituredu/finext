<?php

namespace App\Http\Controllers;

use App\Models\Autonomo;
use App\Models\Gestor;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => [
                'required',
                'min:8',
                'regex:/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/'
            ],
            'rol' => 'required|in:particular,gestor,autonomo',
            'dni' => 'required_if:rol,autonomo|nullable|string|max:255|unique:autonomos,dni',
            'birthdate' => 'required_if:rol,autonomo|nullable|date',
            'modulo_iva' => 'nullable|numeric|min:0|max:100',
            'estado_civil' => 'nullable|in:soltero,casado,divorciado,separado,viudo,pareja_de_hecho',
            'empresa' => 'required_if:rol,autonomo|nullable|string|max:255',
            'irpf' => 'nullable|numeric|min:0|max:100',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'username' => $request->username,
                'full_name' => $request->full_name,
                'phone_number' => $request->phone_number,
                'rol' => $request->rol,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            if ($request->rol === 'gestor') {
                Gestor::create([
                    'user_id' => $user->id,
                ]);
            }

            if ($request->rol === 'autonomo') {
                Autonomo::create([
                    'user_id' => $user->id,
                    'dni' => $request->dni,
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

        app()->terminating(function () use ($user) {
            $user->sendEmailVerificationNotification();
        });

        return response()->json([
            'message' => 'Te hemos enviado un correo para verificar tu cuenta.',
            'user' => $user->only(['id', 'username', 'email']),
            'token' => $token,
            'requires_verification' => true,
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

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
            'user' => $user,
            'token' => $token
        ]);
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
        ]);

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

        app()->terminating(function () use ($user) {
            $user->sendEmailVerificationNotification();
        });

        return response()->json([
            'message' => 'Te hemos reenviado el correo de verificación.',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'No hemos podido enviar el correo de recuperación a esa dirección.',
            ], 422);
        }

        return response()->json([
            'message' => 'Te hemos enviado un correo para restablecer tu contraseña.',
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
        $user = $request->user()->load(['autonomo', 'gestor']);

        return response()->json($this->withAvatarUrl($user));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'full_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'rol' => 'required|in:particular,gestor,autonomo',
            'dni' => [
                'required_if:rol,autonomo',
                'nullable',
                'string',
                'max:255',
                Rule::unique('autonomos', 'dni')->ignore($user->id, 'user_id'),
            ],
            'birth_date' => 'nullable|date',
            'modulo_iva' => 'required_if:rol,autonomo|nullable|numeric|min:0|max:100',
            'civil_state' => 'nullable|in:soltero,casado,divorciado,separado,viudo,pareja_de_hecho',
            'company' => 'required_if:rol,autonomo|nullable|string|max:255',
            'irpf' => 'required_if:rol,autonomo|nullable|numeric|min:0|max:100',
        ]);

        DB::transaction(function () use ($user, $data) {
            $user->update([
                'username' => $data['username'],
                'full_name' => $data['full_name'],
                'phone_number' => $data['phone_number'] ?? null,
                'rol' => $data['rol'],
            ]);

            if ($data['rol'] === 'gestor') {
                $user->autonomo()->delete();
                Gestor::firstOrCreate(['user_id' => $user->id]);
            }

            if ($data['rol'] === 'particular') {
                $user->autonomo()->delete();
                $user->gestor()->delete();
            }

            if ($data['rol'] === 'autonomo') {
                $user->gestor()->delete();
                Autonomo::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'dni' => $data['dni'],
                        'birth_date' => $data['birth_date'] ?? null,
                        'modulo_iva' => $data['modulo_iva'] ?? null,
                        'civil_state' => $data['civil_state'] ?? null,
                        'company' => $data['company'],
                        'irpf' => $data['irpf'] ?? null,
                    ]
                );
            }
        });

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo', 'gestor'])));
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

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo', 'gestor'])));
    }

    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json($this->withAvatarUrl($user->fresh()->load(['autonomo', 'gestor'])));
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

        return $user;
    }
}
