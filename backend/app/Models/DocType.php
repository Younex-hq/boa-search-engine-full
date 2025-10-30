<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocType extends Model
{
  /** @use HasFactory<\Database\Factories\DocTypeFactory> */
  use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'is_active',
  ];

  /**
   * Get the documents for the document type.
   */
  public function documents(): HasMany
  {
    return $this->hasMany(Document::class, 'doc_type_id');
  }
}
