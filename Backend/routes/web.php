<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');