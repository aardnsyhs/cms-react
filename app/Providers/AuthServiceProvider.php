<?php

namespace App\Providers;

use App\Models\ContentType;
use App\Models\Entry;
use App\Policies\ContentTypePolicy;
use App\Policies\EntryPolicy;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    protected $policies = [
        Entry::class => EntryPolicy::class,
        ContentType::class => ContentTypePolicy::class,
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
