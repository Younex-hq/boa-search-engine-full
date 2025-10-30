<?php

use App\Providers\AppServiceProvider;
use App\Providers\AuthServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route; // <-- IMPORT THE ROUTE FACADE
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php', // Keep the default/latest API file if needed
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',

        // ! add new routes versions :
        // Add this 'then' closure to register more routes manually
        // Note: In some Laravel versions, you might add this logic directly
        // inside the main configure closure, or within ->withMiddleware
        then: function () {
            // Load V1 API routes with specific prefix and middleware
            Route::middleware('api') // Apply the 'api' middleware group
                ->prefix('api/v1')   // Prefix routes with /api/v1 so we don't have to write it manualy in api_v1.php
                ->group(base_path('routes/api_v1.php')); // Load your file

            // You could add more versions here if needed
            // Route::middleware('api')
            //      ->prefix('api/v2')
            //      ->group(base_path('routes/api_v2.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->prependToGroup('api', \Illuminate\Http\Middleware\HandleCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, Request $request) {
    if ($request->expectsJson()) {
        $data = [
            'message' => $e->getMessage(),
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ];
        try {
            return response()->json($data, $e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface ? $e->getStatusCode() : 500);
        } catch (Throwable $encodeError) {
            return response("Internal Server Error: Unable to encode response. Original message: " . $e->getMessage(), 500, ['Content-Type' => 'text/plain']);
        }
    }
    return null;
});
    })
    ->withProviders([ // we add this for AuthServiceProvider for the policies
        AppServiceProvider::class,         // Default App Service Provider
        AuthServiceProvider::class,        // Your newly added Auth Service Provider
    ])
    ->create();
