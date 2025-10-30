<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocTypeRequest extends FormRequest
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
      'data.attributes.name' => 'required|string',
      // 'data.attributes.isActive' => 'sometimes|boolean',
    ];
  }

  public function messages()
  {
    // give a custom error message
    return [
      'data.attributes.isActive' => 'The isActive value is invalid. Please enter a Boolean'
    ];
  }
}
