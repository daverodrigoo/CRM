<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            // Using string for custom CHIMES-XXXXX format
            $table->string('Lead_ID')->primary(); 
            
            // Foreign Key linking to the businesses table
            $table->unsignedBigInteger('Business_ID');
            $table->foreign('Business_ID')->references('Business_ID')->on('businesses')->onDelete('cascade');
            
            $table->date('Date_Added');
            $table->string('Source')->nullable();
            $table->string('Tab_Category')->nullable();
            $table->text('Solution_Needed')->nullable();
            $table->text('Remarks')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};