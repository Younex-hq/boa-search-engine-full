<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'type' => 'location',
      'id' => $this->id,
      'attributes' => [
        'name' => $this->name,
        $this->mergeWhen($request->routeIs('locations.*'), [
          'createdAt' => $this->created_at, // add ->toIso8601String() for more formating like timezone offset
          'updatedAt' => $this->updated_at
        ]),
        // to show direction from location alger, it will call direction with the alger location
      ],
      'links' => [
        'self' => route('locations.show', ['location' => $this->id])
      ],
    ];
  }
}
