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
        Schema::create('assigned_lead_inquiries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('Assigned_Lead_ID');
            $table->string('Inquiry_Type'); // e.g., 'LinkedIn', 'Cold Call'
            $table->timestamps();

            $table->foreign('Assigned_Lead_ID')->references('Assigned_Lead_ID')->on('assigned_leads')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_lead_inquiries');
    }
};
