<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContentFieldRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('content_types.update') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'handle' => ['required', 'string', 'max:120', 'regex:/^[a-zA-Z_][a-zA-Z0-9_]*$/'],
            'type' => ['required', 'in:text,richtext,media,relation,json,repeater'],
            'options' => ['nullable', 'array'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
