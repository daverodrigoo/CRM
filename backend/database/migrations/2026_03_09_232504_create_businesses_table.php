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
        Schema::create('businesses', function (Blueprint $table) {
            $table->id('Business_ID');
            $table->string('Business_Name');
            $table->string('Industry');
            $table->string('Website_Link')->nullable();
            
            // Contact Person Info
            $table->string('Contact_Person_First_Name')->nullable();
            $table->string('Contact_Last_Name')->nullable();
            $table->string('Contact_Person_Phone')->nullable();
            $table->string('Contact_Person_Email')->nullable();
            
            // Business Owner Info
            $table->string('Business_Owner_First_Name')->nullable();
            $table->string('Business_Owner_Last_Name')->nullable();
            $table->string('Business_Owner_Phone')->nullable();
            $table->string('Business_Owner_Email')->nullable();
            
            // Business General Info
            $table->string('Business_Phone')->nullable();
            $table->string('Business_Email')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};