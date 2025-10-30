<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'data.attributes.title' => 'sometimes|string|max:500',
      'data.attributes.docCreationDate' => 'sometimes|nullable|date',
      // 'data.attributes.type' => 'sometimes|string|in:pdf',
      'data.attributes.isActive' => 'sometimes|boolean',

      // Relationships
      'data.attributes.docType' => 'sometimes|nullable|int|exists:doc_types,id',
      'data.attributes.docStatut' => 'sometimes|nullable|int|exists:doc_statuts,id',
      // 'data.relationships.relatedDocument.data.id' => 'sometimes|nullable|int|exists:documents,id',
    ];
  }
}
