<?php

namespace Database\Seeders;

use App\Models\ContentType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContentType::firstOrCreate(['slug' => 'article'], ['name' => 'Article']);
        ContentType::firstOrCreate(['slug' => 'event'], ['name' => 'Event']);
        ContentType::firstOrCreate(['slug' => 'doc'], ['name' => 'Doc']);
    }
}
