<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'type' => 'notification',
      'id' => $this->id,
      'attributes' => [
        'content' => $this->content,
        'isRead' => $this->is_read,
      ],
      'relationships' => [
        'author' => [
          'data' => [
            'type' => $this->author->is_admin ? 'admin' : 'user',
            'id' => $this->author->id,
            'firstName' => substr($this->author->first_name, 0, 2), // show only the first 2 letter
            'lastName' => $this->author->last_name,
            'email' => $this->author->email,
          ],
          'links' => [
            'self' => route('users.show', ['user' => $this->author_id]),
          ],
        ],
      ],
      'links' => [
        'self' => route('notifications.show', ['notification' => $this->id]),
      ]
    ];
  }
}
