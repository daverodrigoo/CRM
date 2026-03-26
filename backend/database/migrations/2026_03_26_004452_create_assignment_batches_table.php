<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assignment_batches', function (Blueprint $table) {
            $table->id('Batch_ID'); 
            $table->unsignedBigInteger('user_id'); // The Employee who owns the tab
            $table->string('Batch_Name'); // e.g., "April Outreach"
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_batches');
    }
};
