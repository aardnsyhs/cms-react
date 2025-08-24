<?php

namespace App\Http\Controllers\Admin;

use App\Models\ContentType;
use App\Http\Requests\StoreContentTypeRequest;
use App\Http\Requests\UpdateContentTypeRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = (string) $request->query('q');

        $types = ContentType::query()
            ->withCount('entries')
            ->when(
                $q,
                fn($qb) =>
                $qb->where(function ($qq) use ($q) {
                    $qq->where('name', 'like', "%{$q}%")
                        ->orWhere('slug', 'like', "%{$q}%");
                })
            )
            ->orderBy('updated_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/ContentTypes/Index', [
            'types' => $types,
            'filters' => ['q' => $q],
            'can' => [
                'create' => $request->user()?->can('content_types.create') ?? false,
                'update' => $request->user()?->can('content_types.update') ?? false,
                'delete' => $request->user()?->can('content_types.delete') ?? false,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/ContentTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContentTypeRequest $request)
    {
        $type = ContentType::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'settings' => $request->input('settings', []),
        ]);

        return redirect()->route('admin.content-types.edit', $type)->with('success', 'Type created');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContentType $contentType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContentType $contentType)
    {
        $contentType->load(['fields' => fn($q) => $q->orderBy('order')]);

        return Inertia::render('Admin/ContentTypes/Edit', [
            'type' => $contentType,
            'fields' => $contentType->fields,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContentTypeRequest $request, ContentType $contentType)
    {
        $contentType->update($request->validated());

        return back()->with('success', 'Type updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContentType $contentType)
    {
        $contentType->delete();

        return redirect()->route('admin.content-types.index')->with('success', 'Type deleted');
    }
}
