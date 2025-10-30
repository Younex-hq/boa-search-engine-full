<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocTypeResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'type' => 'docType',
      'id' => $this->id,
      'attributes' => [
        'name' => $this->name,
        $this->mergeWhen($request->routeIs('docTypes.*'), [
          'isActive' => $this->is_active,
          'createdAt' => $this->created_at,
          'updatedAt' => $this->updated_at,
        ]),
      ],
      'links' => [
        'self' => route('docTypes.show', ['docType' => $this->id])
      ]

    ];
  }
}
