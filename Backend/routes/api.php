<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);
Route::get('/check-username', [AuthController::class, 'checkUsername']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

//Transaction Functionalities Routes.
//middleware -> verificacion de usuario
// Route::middleware('auth:sanctum')->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'delete']);
// });

Route::apiResource('categories', CategoryController::class);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//CRUD CATEGORIES
Route::get('/categories', [CategoryController::class,'index']);
Route::post('/categories/{name}/{user_id?}', [CategoryController::class,'store']);
Route::delete('/categories/{id}', [CategoryController::class,'destroy']);