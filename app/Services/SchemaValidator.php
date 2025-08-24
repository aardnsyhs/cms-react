<?php

namespace App\Services;

use App\Models\ContentType;

class SchemaValidator
{
    public static function rulesFor(ContentType $type): array
    {
        $rules = [];
        foreach ($type->fields()->orderBy('order')->get() as $f) {
            $key = "data.{$f->handle}";
            $opt = $f->options ?? [];
            $base = match ($f->type) {
                'text' => 'string',
                'richtext' => 'string',
                'media' => 'string|exists:media,id',
                'relation' => 'string',
                'json' => 'array',
                'repeater' => 'array',
                default => 'string',
            };
            $rules[$key] = ($opt['required'] ?? false) ? "required|$base" : "nullable|$base";
            if (isset($opt['max']))
                $rules[$key] .= "|max:{$opt['max']}";
        }
        return $rules;
    }
}
