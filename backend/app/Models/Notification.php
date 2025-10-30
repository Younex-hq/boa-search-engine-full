<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Http\Filters\V1\QueryFilter;
use Illuminate\Database\Eloquent\Builder;

class Notification extends Model
{
  use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'content',
    'author_id',
    'is_read',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'is_read' => 'boolean',
  ];

  /**
   * Get the author that owns the notification.
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function author(): BelongsTo
  {
    return $this->belongsTo(User::class, 'author_id');
  }

  // ! for filtering
  public function scopeFilter(Builder $builder, QueryFilter $filters)
  {
    return $filters->apply($builder);
  }
}
