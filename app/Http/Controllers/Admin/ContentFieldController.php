<?php

namespace App\Http\Controllers\Admin;

use App\Models\ContentField;
use App\Http\Requests\StoreContentFieldRequest;
use App\Http\Requests\UpdateContentFieldRequest;
use App\Http\Controllers\Controller;
use App\Models\ContentType;
use Illuminate\Support\Facades\Request;

class ContentFieldController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContentFieldRequest $request, ContentType $contentType)
    {
        if ($contentType->fields()->where('handle', $request->handle)->exists()) {
            return back()->withErrors(['handle' => 'Handle already exists in this content type.']);
        }

        $maxOrder = (int) $contentType->fields()->max('order');
        $field = $contentType->fields()->create([
            'name' => $request->name,
            'handle' => $request->handle,
            'type' => $request->type,
            'options' => $request->input('options', []),
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Field added');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContentFieldRequest $request, ContentType $contentType, ContentField $contentField)
    {
        abort_unless($contentField->content_type_id === $contentType->id, 404);

        if ($contentType->fields()->where('handle', $request->handle)->where('id', '!=', $contentField->id)->exists()) {
            return back()->withErrors(['handle' => 'Handle already exists in this content type.']);
        }

        $contentField->update($request->validated());

        return back()->with('success', 'Field updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContentType $contentType, ContentField $contentField)
    {
        abort_unless($contentField->content_type_id === $contentType->id, 404);
        $contentField->delete();

        return back()->with('success', 'Field deleted');
    }

    public function reorder(Request $request, ContentType $contentType)
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:content_fields,id'],
        ]);

        foreach ($data['ids'] as $i => $id) {
            ContentField::where('id', $id)->where('content_type_id', $contentType->id)->update(['order' => $i]);
        }

        return back()->with('success', 'Fields reordered');
    }
}
