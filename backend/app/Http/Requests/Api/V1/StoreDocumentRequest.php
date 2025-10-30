<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
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

  // rules for : title, type, direction_id, user_id, document_creation_date, doc_type_id, doc_statut_id, related_document, file pdf, file_sha256, extracted_text
  public function rules(): array
  {
    return [
      'data.attributes.title' => 'required|string|max:500', // title max length 500 characters
      //   'data.attributes.type' => 'required|string|in:pdf',
      'data.attributes.type' => 'required|string',
      'data.attributes.docCreationDate' => 'nullable|date',
      'data.attributes.file' => 'required|file|mimes:pdf|max:40000', // 40MB max pdf size, file size
      //   'data.attributes.file' => 'required|file|max:40000', // 40MB max size

      // Relationships
      'data.attributes.docType' => 'nullable|int|exists:doc_types,id', // name of the table in the database
      'data.attributes.docStatuts' => 'nullable|int|exists:doc_statuts,id',
      'data.relationships.relatedDocument.data.id' => 'nullable|int|exists:documents,id',
      // Author is now automatically set to the authenticated user
      // Direction is now automatically set based on the user's direction
    ];
  }

  /**
   * Get custom messages for validator errors.
   *
   * @return array<string, string>
   */
  public function messages(): array
  {
    return [
      'data.attributes.title.required' => 'The document title is required.',
      'data.attributes.title.max' => 'The document title cannot exceed 500 characters.',
      'data.attributes.type.required' => 'The document type is required.',
      'data.attributes.type.in' => 'The document type must be PDF.',
      'data.attributes.file.required' => 'A PDF file is required.',
      'data.attributes.file.mimes' => 'The file must be a PDF document.',
      'data.attributes.file.max' => 'The file size cannot exceed 40MB.',
    ];
  }
}

/* Example JSON structure for document creation:
{
    "data": {
        "attributes": {
            "title": "title test 1",
            "type": "pdf",
            "docType": 1,
            "docCreationDate": "1999-01-01",
            "docStatus": 1,
            "file": "[PDF file binary data]"
        },
        "relationships": {
            "relatedDocument": {
                "data":{
                    "id": 2
                }
            }
        }
    }
}
*/
