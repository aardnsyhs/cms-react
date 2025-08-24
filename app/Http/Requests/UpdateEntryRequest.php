<?php

namespace App\Http\Requests;

use App\Models\ContentType;
use App\Services\SchemaValidator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEntryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $type = ContentType::findOrFail($this->route('type_id'));

        return array_merge([
            'locale' => ['required', 'string', 'max:10'],
            'slug' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:draft,review,scheduled,published,archived'],
            'schedule_at' => ['nullable', 'date'],
            'publish_at' => ['nullable', 'date'],
            'unpublish_at' => ['nullable', 'date', 'after_or_equal:publish_at'],
        ], SchemaValidator::rulesFor($type));
    }
}
