<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\RecurrentTransactionController;
use App\Http\Controllers\ContactController;

// AUTH PUBLICO: estas rutas no necesitan token porque sirven para crear sesion,
// registrar usuarios, verificar correo, recuperar password o iniciar Google OAuth.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
Route::post('/email/verification-notification', [AuthController::class, 'resendVerificationEmail']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);
Route::get('/check-username', [AuthController::class, 'checkUsername']);
Route::post('/contact', [ContactController::class, 'send']);

// AUTH PRIVADO: Sanctum lee el Bearer token, busca el usuario propietario
// y solo entonces permite entrar a las operaciones del dashboard.
Route::middleware(['auth:sanctum','generate.recurrents'])->group(function () {

    // Usuario autenticado
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/me/role', [AuthController::class, 'currentUserRole']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::delete('/me', [AuthController::class, 'deleteAccount']);
    Route::post('/me/avatar', [AuthController::class, 'updateAvatar']);
    Route::delete('/me/avatar', [AuthController::class, 'deleteAvatar']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class,'store']);
    Route::put('/transactions/{id}', [TransactionController::class,'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'delete']);
    Route::get('/transactions/bill/{billId}', [TransactionController::class, 'getByBill']);
    // Recurrent transactions
    Route::get('/recurrent-transactions', [RecurrentTransactionController::class, 'index']);
    Route::post('/recurrent-transactions', [RecurrentTransactionController::class, 'store']);
    Route::put('/recurrent-transactions/{id}', [RecurrentTransactionController::class, 'update']);
    Route::delete('/recurrent-transactions/{id}', [RecurrentTransactionController::class, 'delete']);
    Route::post('/recurrent-transactions/{id}/generate', [RecurrentTransactionController::class, 'generateNext']);
    // Bills
    Route::get('/bills', [BillController::class, 'index']);
    Route::post('/bills', [BillController::class,'store']);
    Route::put('/bills/{id}', [BillController::class,'update']);
    Route::delete('/bills/{id}', [BillController::class, 'delete']);
    // CRUD Categories
    Route::get('/categories', [CategoryController::class,'index']);
    Route::post('/categories', [CategoryController::class,'store']);
    Route::put('/categories/{id}', [CategoryController::class,'update']);
    Route::delete('/categories/{id}', [CategoryController::class,'destroy']);

    Route::get('/goals', [GoalController::class,'index']);
    Route::post('/goals',[GoalController::class,'store']);
    Route::put('/goals/{id}',[GoalController::class,'update']);
    Route::put('/goals/contribute/{id}',[GoalController::class,'addContribution']);
    Route::delete('/goals/{id}',[GoalController::class,'destroy']);
});

// Route::apiResource('categories', CategoryController::class);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
