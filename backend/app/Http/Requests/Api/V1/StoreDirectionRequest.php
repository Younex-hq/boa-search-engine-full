<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreDirectionRequest extends FormRequest
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
      'data.attributes.name' => 'required|string|unique:directions,name',
      'data.attributes.location' => 'nullable|int|exists:locations,id', // location_id
      'data.relationships.parent.data.name' => 'nullable|integer|exists:directions,id', // parent_direction_id
    ];
  }
}

/*
{
    "data": {
        "attributes": {
            "name": "test1",
            "location": 3
        },
        "relationship": {
            "parent": {
                "data": {
                    "name": 1
                }
            }
        }
    }
}
*/
