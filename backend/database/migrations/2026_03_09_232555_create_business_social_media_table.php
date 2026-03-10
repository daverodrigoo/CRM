<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_social_media', function (Blueprint $table) {
            $table->id('Social_Media_ID');
            
            // Foreign Key linking to the businesses table
            $table->unsignedBigInteger('Business_ID');
            $table->foreign('Business_ID')->references('Business_ID')->on('businesses')->onDelete('cascade');
            
            $table->string('URL');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_social_media');
    }
};