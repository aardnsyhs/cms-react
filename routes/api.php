<?php

use App\Http\Controllers\Api\EntryPreviewController;
use App\Http\Controllers\Api\EntryReadController;
use App\Http\Controllers\Api\TypeReadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/types/{slug}', TypeReadController::class);
Route::get('/entries/{slug}', EntryReadController::class);
Route::get('/entries/{id}/preview/{token}', EntryPreviewController::class);
