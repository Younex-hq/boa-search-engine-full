<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Filters\V1\QueryFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
  use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'type',
    'doc_type_id',
    'title',
    'direction_id',
    'user_id',
    'document_creation_date',
    'doc_statut_id',
    'file',
    'extracted_text',
    'related_document',
    'file_sha256',
    'is_active',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'document_creation_date' => 'date',
  ];

  /**
   * Get the direction that owns the document.
   */
  public function direction(): BelongsTo
  {
    return $this->belongsTo(Direction::class);
  }

  /**
   * Get the user that owns the document.
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the related document.
   */
  public function relatedDocument(): BelongsTo
  {
    return $this->belongsTo(Document::class, 'related_document');
  }

  /**
   * Get the documents related to this document.
   */
  public function relatedDocuments()
  {
    return $this->hasMany(Document::class, 'related_document');
  }

  /**
   * Get the document type that owns the document.
   */
  public function docType(): BelongsTo
  {
    return $this->belongsTo(DocType::class, 'doc_type_id');
  }

  /**
   * Get the document status that owns the document.
   */
  public function docStatut(): BelongsTo
  {
    return $this->belongsTo(DocStatut::class, 'doc_statut_id');
  }


  // ! for filtering
  public function scopeFilter(Builder $builder, QueryFilter $filters)
  {
    return $filters->apply($builder);
  }
}
