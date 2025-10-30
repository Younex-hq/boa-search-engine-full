<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DirectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'direction',
            'id' => $this->id,
            'attributes' => [
                'name' => $this->name,
                $this->mergeWhen(
                    $request->routeIs('directions.*'),
                    [ // show only if the route is directions.
                        'isActive' => $this->is_active,
                        'location' => $this->location?->name,
                        'createdAt' => $this->created_at,
                        'updatedAt' => $this->updated_at,
                    ],
                )
            ],

            $this->mergeWhen($request->routeIs('directions.*'), [ // show only if the route is directions.
                'relationships' => [
                    'parent' => $this->parent_direction_id ? [
                        'data' => [
                            'type' => 'direction',
                            'id' => $this->parent_direction_id,
                            'name' => $this->parentDirection?->name,
                        ],
                        'links' => [
                            'self' => $this->parent_direction_id ? route('directions.show', ['direction' => $this->parent_direction_id]) : null, // we just double check
                        ]
                    ] : null,
                    'location' => $this->location ? [
                        'data' => [
                            'type' => 'location',
                            'id' => $this->location?->id,
                            'name' => $this->location?->name,
                        ],
                        'links' => [
                            'self' => route('locations.show', ['location' => $this->location->id])
                        ]
                    ] : null,
                ],
            ]),
            'links' => [
                'self' => route('directions.show', ['direction' => $this->id]),
            ]
        ];
    }
}
