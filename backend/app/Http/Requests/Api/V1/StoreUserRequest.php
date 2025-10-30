<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    // Only allow admin users to create new users
    return $this->user() && $this->user()->is_admin;
  }

  /**
   * Get the error message for authorization failure.
   *
   * @return string
   */
  public function failedAuthorization()
  {
    throw new \Illuminate\Auth\Access\AuthorizationException("Vous n'êtes pas autorisé à créer un nouvel utilisateur.");
    // you have to throw an exception a error() response will continue the executing the code
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    // Email format validation // Uniqueness check against existing users
    return [
      'data.attributes.email' => 'required|string|email|unique:users,email', // Email format validation // Uniqueness check against existing users
      'data.attributes.firstName' => 'required|string',
      'data.attributes.lastName' => 'required|string',
      'data.attributes.password' => 'required|string|min:8', // password
      'data.attributes.isAdmin' => 'sometimes|boolean', // Optional with default false
      'data.attributes.isActive' => 'sometimes|boolean', // Optional with default true
      'data.relationships.direction.data.name' => 'nullable|int|exists:directions,id', // direction_id
    ];
  }
}
/*
{
    "data": {
        "attributes": {
            "firstName": "testName",
            "lastName": "testLast",
            "email": "test@mail.org",
            "password" : "password",
            "isAdmin": false,
            // "isActive": 1
        },
        "relationships": {
            "direction": {
                "data": {
                    "name": 4
                }
            }
        }
    }
}
*/
