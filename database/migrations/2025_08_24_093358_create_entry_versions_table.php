<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('entry_versions', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->foreignUuid('entry_id')->references('id')->on('entries')->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->json('data');
            $table->foreignUuid('created_by')->nullable()->references('id')->on('users');
            $table->timestamp('created_at');
            $table->string('comment')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entry_versions');
    }
};
