<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);
Route::get('/check-username', [AuthController::class, 'checkUsername']);


Route::middleware('auth:sanctum')->group(function () {

    // Usuario autenticado
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'delete']);
});

// Route::apiResource('categories', CategoryController::class);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//CRUD CATEGORIES
Route::get('/categories', [CategoryController::class,'index']);
Route::get('/categories/{id}', [CategoryController::class,'CategoriesPerId']);
Route::post('/categories', [CategoryController::class,'store']);
Route::delete('/categories/{id}', [CategoryController::class,'destroy']);