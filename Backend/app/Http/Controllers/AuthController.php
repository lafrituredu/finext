<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
        {
            $request->validate([
                'username' => 'required|unique:users',
                'full_name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => [
                    'required',
                    'min:8',
                    'regex:/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/'
                ],
                'rol' => 'required|in:gestor,autonomo'
            ]);

            $user = User::create([
                'username' => $request->username,
                'full_name' => $request->full_name,
                'phone_number' => $request->phone_number,
                'rol' => $request->rol,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            
            $token = $user->createToken('auth_token')->plainTextToken;

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