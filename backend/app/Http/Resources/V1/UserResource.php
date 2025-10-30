<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'type' => $this->is_admin ? 'admin' : 'user',
      'id' => $this->id,
      'attributes' => [
        'firstName' => $this->first_name,
        'lastName' => $this->last_name,
        'email' => $this->email,
        'isAdmin' => $this->is_admin,
        'isActive' => $this->is_active,
        $this->mergeWhen($request->routeIs('users.*'), [ // show this info only in the users. route
          'emailVefifiedAt' => $this->email_verified_at,
          'createdAt' => $this->created_at,
          'updatedAt' => $this->updated_at,
        ]),
      ],
      $this->mergeWhen($request->routeIs('users.*'), [ // show this info only in the users. route
        'relationships' => [
          'direction' => [
            'data' => [
              'type' => 'direction',
              // 'id' => $this->direction_id,
              'name' => $this->direction?->name, // same as : $this->direction ? $this->direction->name : null
              'location' => $this->direction?->location?->name
            ],
            'links' => [
              'self' => $this->direction_id ? route('directions.show', ['direction' => $this->direction_id]) : null,
            ]
          ]
        ],
      ]),
      'links' => [
        'selfe' => route('users.show', ['user' => $this->id])
      ]
    ];
  }
}
