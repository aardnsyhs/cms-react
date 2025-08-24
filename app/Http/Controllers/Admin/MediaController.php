<?php

namespace App\Http\Controllers\Admin;

use App\Models\Media;
use App\Http\Requests\StoreMediaRequest;
use App\Http\Requests\UpdateMediaRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class MediaController extends Controller
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
    public function store(StoreMediaRequest $request)
    {
        $request->validate(['file' => 'required|file|max:10240']);
        $path = $request->file('file')->store('media', 'public');
        $image = null;
        [$width, $height] = [null, null];

        if (str_starts_with($request->file('file')->getMimeType(), 'image/')) {
            [$width, $height] = getimagesize($request->file('file')->getRealPath());
        }

        $media = Media::create([
            'disk' => 'public',
            'path' => $path,
            'mime' => $request->file('file')->getMimeType(),
            'size' => $request->file('file')->getSize(),
            'width' => $width,
            'height' => $height,
            'alt' => $request->input('alt'),
            'created_by' => Auth::id(),
        ]);
        return response()->json($media, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $media)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Media $media)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMediaRequest $request, Media $media)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media)
    {
        //
    }
}
