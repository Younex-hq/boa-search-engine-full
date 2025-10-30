<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    // Authorization is handled in the controller
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
      'data.attributes.isActive' => 'sometimes|boolean',
      'data.attributes.email' => 'sometimes|string|email|unique:users,email',
      'data.attributes.firstName' => 'sometimes|string',
      'data.attributes.lastName' => 'sometimes|string',
      'data.attributes.password' => 'sometimes|string|min:8',
      'data.attributes.isAdmin' => 'sometimes|boolean',
      'data.relationships.direction.data.name' => 'sometimes|nullable|int|exists:directions,id',
    ];
  }
}
