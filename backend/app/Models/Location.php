<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Location extends Model
{
  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
  ];

  public function directions(): HasMany
  {
    return $this->hasMany(Direction::class);
  }

  public function location(): BelongsTo
  {
    return $this->belongsTo(Location::class);
  }
}
