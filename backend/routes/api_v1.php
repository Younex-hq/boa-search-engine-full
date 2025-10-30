<?php

use App\Http\Controllers\Api\V1\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UsersController;
use App\Http\Controllers\Api\V1\DocTypeController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\DirectionController;
use App\Http\Controllers\Api\V1\DocStatutController;

use App\Http\Controllers\API\v1\SearchController;


Route::middleware(['auth:sanctum', 'throttle:api', \App\Http\Middleware\IsActive::class, \Illuminate\Http\Middleware\HandleCors::class])->group(function () {

  Route::apiResource('docs', DocumentController::class);
  Route::patch('docs/{id}/restore', [DocumentController::class, 'restore']);
  Route::get('docs/user/{id}', [DocumentController::class, 'userDocs']);

  Route::apiResource('users', UsersController::class);
  Route::patch('users/{id}/restore', [UsersController::class, 'restore']);

  Route::apiResource('directions', DirectionController::class);
  Route::patch('directions/{id}/restore', [DirectionController::class, 'restore']);
  Route::apiResource('locations', LocationController::class);
  Route::apiResource('docTypes', DocTypeController::class);
  Route::apiResource('docStatuts', DocStatutController::class);

  Route::apiResource('notifications', NotificationController::class);

  Route::get('/user', function (Request $request) {
    return $request->user();
  });
});

// ! Public route for search - accessible without authentication but rate limited
Route::middleware(['throttle:search'])->get('search/{query}', [SearchController::class, 'index'])->name('search.index');

Route::middleware(['throttle:pdf-downloads'])->get('docs/{doc}/pdf', [DocumentController::class, 'downloadPdf']); // Route to download PDF file limited to 15 requests per minute

Route::middleware(['throttle:60,1'])->post('notifications/public', [NotificationController::class, 'storePublic']);



// ?  token expires in 60 minutes, file: AuthController.php
// ?  user can update his docs in 10 days period, file: DocumentPolicy.php

