<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsActive
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle(Request $request, Closure $next)
  {
    if (Auth::check() && ! Auth::user()->is_active) {
      return response()->json(['message' => "Votre compte est inactif. Veuillez contacter un administrateur."], 403);
    }

    return $next($request);
  }
}
