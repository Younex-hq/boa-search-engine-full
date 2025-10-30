<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocStatut extends Model
{
  protected $fillable = [
    'name',
    'is_active',
  ];
  /**
   * Get the documents for the document status.
   */
  public function documents(): HasMany
  {
    return $this->hasMany(Document::class, 'doc_statut_id');
  }
}
