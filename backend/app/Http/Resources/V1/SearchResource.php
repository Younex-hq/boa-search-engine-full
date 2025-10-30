<?php

namespace App\Http\Resources\V1;

use App\Http\Controllers\Api\V1\DocumentController;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'type' => 'Document',
      'id' => $this->id,
      'attributes' => [
        'title' => $this->title,
        'docStatut' => $this->docStatut?->name,
      ],
      'links' => [
        'download' => action([DocumentController::class, 'downloadPdf'], ['doc' => $this->id]),
      ],
      $this->merge([
        'relationships' => [
          'relatedDocument' => $this->related_document ? [
            'data' => [
              'type' => 'document',
              'id' => $this->related_document,
              'attributes' => [
                'title' => $this->relatedDocument?->title,
                'docStatut' => $this->relatedDocument?->docStatut?->name,
              ],
              'links' => [
                'download' => action([DocumentController::class, 'downloadPdf'], ['doc' => $this->related_document]),
              ],
            ]
          ] : null,
        ],
      ], ),
    ];
  }
}

/* Example output when using this resource:
{
    "data": [
        {
            "type": "Document",
            "id": 18,
            "attributes": {
                "title": "test 6 api update2",
                "docStatut": "Updated"
            },
            "links": {
                "download": "http://localhost:8800/api/v1/docs/18/pdf"
            },
            "relationships": {
                "relatedDocument": {
                    "data": {
                        "type": "document",
                        "id": 17,
                        "attributes": {
                            "title": "test 5 api",
                            "docStatut": "Updated"
                        },
                        "links": {
                            "download": "http://localhost:8800/api/v1/docs/17/pdf"
                        }
                    }
                }
            }
        },
        "total_results": 20,
        "query": "test the update",
        "normalized_query": "test the update"
    }
}
*/
