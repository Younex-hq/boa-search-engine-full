<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  return response()->json([
    'message' => 'Hello, this is BoA Search Engin API!'
  ], 200); // status code : 200 ok
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);


// in api_v1.php
//  Public route for forgotpassword - accessible without authentication but rate limited
// Route::middleware(['throttle:60,1'])->post('notifications/public', [NotificationController::class, 'storePublic']); # rate limit: 60 requests per minute


// Route::get('/user', function (Request $request) {
//   return $request->user();
// })->middleware('auth:sanctum');

