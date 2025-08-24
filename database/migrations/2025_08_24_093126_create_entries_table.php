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
        Schema::create('entries', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->foreignUuid('content_type_id')->references('id')->on('content_types')->cascadeOnDelete();
            $table->string('status')->index();
            $table->string('locale', 10)->default('id')->index();
            $table->string('slug')->nullable()->index();
            $table->timestamp('schedule_at')->nullable();
            $table->timestamp('publish_at')->nullable();
            $table->timestamp('unpublish_at')->nullable();
            $table->foreignUuid('created_by')->nullable()->references('id')->on('users');
            $table->foreignUuid('updated_by')->nullable()->references('id')->on('users');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};
