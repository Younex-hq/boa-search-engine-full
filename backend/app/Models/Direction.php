<?php

namespace App\Models;

use App\Http\Filters\V1\QueryFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Direction extends Model
{
  use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'location_id',
    'parent_direction_id',
  ];

  /**
   * Get the parent direction that owns the direction.
   */
  public function parentDirection(): BelongsTo
  {
    return $this->belongsTo(Direction::class, 'parent_direction_id');
  }

  /**
   * Get the child directions for the direction.
   */
  public function childDirections(): HasMany
  {
    return $this->hasMany(Direction::class, 'parent_direction_id');
  }

  /**
   * Get the documents for the direction.
   */
  public function documents(): HasMany
  {
    return $this->hasMany(Document::class);
  }

  /**
   * Get the location that owns the direction.
   */
  public function location(): BelongsTo
  {
    return $this->belongsTo(Location::class);
  }

  /**
   * Get the users for the direction.
   */
  public function users(): HasMany
  {
    return $this->hasMany(User::class);
  }

  // ! for filtering :
  public function scopeFilter(Builder $builder, QueryFilter $filters) // query builder
  {
    return $filters->apply($builder);
    // this will send the builder to the DirectionFilter.php
  }
}
