<?php

namespace App\Http\Controllers\Admin;

use App\Models\ContentType;
use App\Models\Entry;
use App\Http\Requests\StoreEntryRequest;
use App\Http\Requests\UpdateEntryRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class EntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEntryRequest $request, string $type_id)
    {
        $type = ContentType::findOrFail($type_id);

        $entry = Entry::create([
            'content_type_id' => $type->id,
            'status' => $request->input('status'),
            'locale' => $request->input('locale', 'id'),
            'slug' => $request->input('slug'),
            'schedule_at' => $request->date('schedule_at'),
            'publish_at' => $request->date('publish_at'),
            'unpublish_at' => $request->date('unpublish_at'),
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        $lastVer = $entry->versions()->max('version') ?? 0;
        $entry->versions()->create([
            'version' => $lastVer + 1,
            'data' => $request->input('data', []),
            'created_by' => Auth::id(),
            'created_at' => now(),
            'comment' => 'initial',
        ]);

        return back()->with('success', 'Entry created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Entry $entry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Entry $entry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEntryRequest $request, Entry $entry)
    {
        $entry->update($request->only(['status', 'locale', 'slug', 'schedule_at', 'publish_at', 'unpublish_at']) + ['updated_by' => Auth::id()]);
        $lastVer = $entry->versions()->max('version') ?? 0;
        $entry->versions()->create([
            'version' => $lastVer + 1,
            'data' => $request->input('data', []),
            'created_by' => Auth::id(),
            'created_at' => now(),
            'comment' => $request->input('comment'),
        ]);
        return back()->with('success', 'Entry updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entry $entry)
    {
        //
    }
}
