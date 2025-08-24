<?php

use App\Http\Controllers\Admin\ContentTypeController;
use App\Http\Controllers\Admin\EntryController;
use App\Http\Controllers\Admin\PublishController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('types', ContentTypeController::class);
    Route::get('types/{type}/entries', [EntryController::class, 'index'])->name('entries.index');
    Route::post('types/{type_id}/entries', [EntryController::class, 'store'])->name('entries.store');
    Route::put('entries/{entry}', [EntryController::class, 'update'])->name('entries.update');
    Route::post('entries/{entry}/publish', [PublishController::class, 'publish'])->name('entries.publish');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
