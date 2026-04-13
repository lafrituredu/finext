<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);
Route::get('/check-username', [AuthController::class, 'checkUsername']);

Route::apiResource('transactions', TransactionController::class);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});