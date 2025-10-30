<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Filters\V1\QueryFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens; // for api token authentication

class User extends Authenticatable
{
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasFactory, Notifiable;
  use HasApiTokens; // for api token authentication

  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */
  protected $fillable = [
    'first_name',
    'last_name',
    'email',
    'password',
    'direction_id',
    'is_admin',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
      'is_admin' => 'boolean',
    ];
  }

  /**
   * Get the direction that the user belongs to.
   */
  public function direction(): BelongsTo
  {
    return $this->belongsTo(Direction::class);
  }

  /**
   * Get the documents for the user.
   */
  public function documents(): HasMany
  {
    return $this->hasMany(Document::class);
  }

  /**
   * Get the notifications authored by the user.
   */
  public function notifications(): HasMany
  {
    return $this->hasMany(Notification::class, 'author_id');
  }

  // ! for filtering :
  public function scopeFilter(Builder $builder, QueryFilter $filters) // query Eloquent\builder
  {
    return $filters->apply($builder);
    // this will send the builder to the UserFilter.php
  }
}
