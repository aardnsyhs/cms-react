<?php

namespace App\Jobs;

use App\Models\Entry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PublishEntryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public string $entryId, public bool $publish = true)
    {
    }

    public function handle(): void
    {
        $e = Entry::find($this->entryId);

        if (!$e) {
            return;
        }

        $e->update(['status' => $this->publish ? 'published' : 'archived']);

        // TODO: Anda dapat menambahkan logika seperti mengirim webhook di sini
    }
}
