<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationRequest extends FormRequest
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
      'data.attributes.content' => 'required|string',
    ];
  }
}

/*
{
    "data": {
        "type": "notification",
        "id": 1,
        "attributes": {
            "content": "the first noti",
            "isRead": false
        },
        "relationships": {
            "author": {
                "data": {
                    "type": "admin",
                    "firstName": "t",
                    "lastName": "test6",
                    "email": "test6@mail.org"
                },
                "links": {
                    "self": "http://localhost:8800/api/v1/users/16"
                }
            }
        },
        "links": {
            "self": "http://localhost:8800/api/v1/notifications/1"
        }
    }
}
*/
