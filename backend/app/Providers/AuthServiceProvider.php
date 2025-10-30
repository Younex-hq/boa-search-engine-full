<?php

namespace App\Providers;

// Import the correct base class for Authorization Service Providers
use App\Models\Notification;
use App\Policies\V1\DocumentPolicy;
use App\Models\Document;
use App\Models\User;
use App\Models\Direction;
use App\Models\DocType;
use App\Models\DocStatut;
use App\Models\Location;
use App\Policies\V1\NotificationPolicy;
use App\Policies\V1\UserPolicy;
use App\Policies\V1\DirectionPolicy;
use App\Policies\V1\DocTypePolicy;
use App\Policies\V1\DocStatutPolicy;
use App\Policies\V1\LocationPolicy;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate; // Often needed for Gates, good practice to include

class AuthServiceProvider extends ServiceProvider
{
  /**
   * The model to policy mappings for the application.
   *
   * @var array<class-string, class-string>
   */
  protected $policies = [
    Document::class => DocumentPolicy::class,
    User::class => UserPolicy::class,
    Direction::class => DirectionPolicy::class,
    DocType::class => DocTypePolicy::class,
    DocStatut::class => DocStatutPolicy::class,
    Location::class => LocationPolicy::class,
    Notification::class => NotificationPolicy::class,
  ];

  /**
   * Register any authentication / authorization services.
   */
  public function boot(): void
  {
    // Register token abilities
    Gate::define('document:view', function (User $user) {
      return true; // All authenticated users can view documents
    });

    Gate::define('document:create', function (User $user) {
      return true; // All authenticated users can create documents
    });

    Gate::define('document:update-own', function (User $user, Document $document) {
      return $user->id === $document->user_id;
    });

    Gate::define('document:update-any', function (User $user) {
      return $user->is_admin;
    });

    Gate::define('document:delete-own', function (User $user, Document $document) {
      return $user->id === $document->user_id;
    });

    Gate::define('document:delete-any', function (User $user) {
      return $user->is_admin;
    });

  }
}
