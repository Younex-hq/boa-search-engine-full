<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDirectionRequest extends FormRequest
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
      'data.attributes.name' => 'sometimes|string|unique:directions,name',
      'data.attributes.location' => 'sometimes|nullable|int|exists:locations,id', // location_id
      'data.relationships.parent.data.name' => 'sometimes|nullable|integer|exists:directions,id', // parent_direction_id
      'data.attributes.isActive' => 'sometimes|boolean',
    ];
  }
}
