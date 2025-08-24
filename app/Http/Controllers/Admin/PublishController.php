<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublishController extends Controller
{
    public function publish(Request $request, string $entry)
    {
        return back()->with('success', 'Entry published');
    }
}
