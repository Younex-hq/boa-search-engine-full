<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void
  {
    //
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  { // search terms : // rate limiters // rate limit // reate limiting

    // Define a global rate limiter for all API routes
    RateLimiter::for('api', function (Request $request) {
      return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
    });

    // Define a rate limiter specifically for search endpoints
    RateLimiter::for('search', function (Request $request) {
      return Limit::perMinute(200)->by($request->ip());
    });

    // Define a rate limiter specifically for PDF downloads
    RateLimiter::for('pdf-downloads', function (Request $request) {
      return Limit::perMinute(15)->by($request->user()?->id ?: $request->ip());
    });
  }
}

// search terms : // rate limiters // rate limit // reate limiting
