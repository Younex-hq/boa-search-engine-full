<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
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
        'fileType' => $this->type,

        $this->mergeWhen($request->routeIs('docs.*'), [
          'docType' => $this->docType?->name,
          'docCreationDate' => $this->document_creation_date,
          'docStatut' => $this->docStatut?->name,
          'isActive' => $this->is_active,
          'createdAt' => $this->created_at,
          'updatedAt' => $this->updated_at,
        ])
      ],
      $this->mergeWhen($request->routeIs('docs.*'), [
        'relationships' => [
          'author' => $this->when($this->user, function () {
            return [
              'data' => [
                'type' => $this->user->is_admin ? 'admin' : 'user',
                'id' => $this->user_id,
                'email' => $this->user->email,
              ],
              'links' => [
                'self' => route('users.show', ['user' => $this->user_id]),
              ],
            ];
          }),
          'relatedDocument' => $this->when($this->relatedDocument, function () {
            return [
              'data' => [
                'type' => 'document',
                'id' => $this->relatedDocument->id,
                'title' => $this->relatedDocument->title,
                'docType' => $this->relatedDocument->docType?->name,
                'docStatut' => $this->relatedDocument->docStatut?->name,
              ],
              'links' => [
                'self' => route('docs.show', ['doc' => $this->relatedDocument->id]),
              ],
            ];
          }),
          'direction' => $this->when($this->direction, function () {
            return [
              'data' => [
                'type' => 'direction',
                'name' => $this->direction->name,
              ],
              'links' => [
                'self' => route('directions.show', ['direction' => $this->direction->id]),
              ],
            ];
          }),
        ],
      ]),

      'links' => [
        'self' => route('docs.show', ['doc' => $this->id]),
      ],
    ];
  }
}
