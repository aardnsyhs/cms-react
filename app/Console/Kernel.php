<?php

namespace App\Console;

use App\Jobs\PublishEntryJob;
use App\Models\Entry;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            Entry::where('status', 'scheduled')
                ->whereNotNull('publish_at')
                ->where('publish_at', '<=', now())
                ->chunkById(
                    100,
                    fn($chunk) =>
                    $chunk->each(fn($e) => dispatch(new PublishEntryJob($e->id, true)))
                );
            Entry::where('status', 'published')
                ->whereNotNull('unpublish_at')
                ->where('unpublish_at', '<=', now())
                ->chunkById(
                    100,
                    fn($chunk) =>
                    $chunk->each(fn($e) => dispatch(new PublishEntryJob($e->id, false)))
                );
        })->everyMinute();
    }
}
