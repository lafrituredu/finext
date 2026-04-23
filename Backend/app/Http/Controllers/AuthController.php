<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Gestor;
use App\Models\Autonomo;
use Illuminate\Support\Facades\Hash;

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
            'modulo_iva' => 'required_if:rol,autonomo|nullable|numeric|min:0|max:100',
            'estado_civil' => 'nullable|in:soltero,casado,divorciado,separado,viudo,pareja_de_hecho',
            'empresa' => 'required_if:rol,autonomo|nullable|string|max:255',
            'irpf' => 'required_if:rol,autonomo|nullable|numeric|min:0|max:100',
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
        $user->load(['gestor', 'autonomo']);

        return response()->json([
            'message' => 'Usuario registrado',
            'user' => $user,
            'token' => $token
        ]);
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

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login correcto',
        'user' => $user,
        'token' => $token
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

    /**
     * Verificar si el username está disponible
     * GET /api/check-username?username={username}
     */
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
    return response()->json($request->user());
}

    public function logout(Request $request)
    {
        // Elimina el token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout correcto'
        ]);
    }   
    
}
