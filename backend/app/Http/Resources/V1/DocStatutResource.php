<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocStatutResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'type' => 'docStatut',
      'id' => $this->id,
      'attributes' => [
        'name' => $this->name,
        $this->mergeWhen($request->routeIs('docStatuts.*'), [
          'createdAt' => $this->created_at,
          'updatedAt' => $this->updated_at,
        ]),
      ],
      'links' => [
        'self' => route('docStatuts.show', ['docStatut' => $this->id])
      ]
    ];
  }
}
