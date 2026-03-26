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
        Schema::create('assigned_leads', function (Blueprint $table) {
            $table->id('Assigned_Lead_ID'); 
            $table->unsignedBigInteger('Batch_ID'); 
            $table->string('Lead_ID'); // String type because your leads table uses strings like "LD-0001"
            
            // The lean pipeline tracking fields
            $table->date('Date_Assigned')->useCurrent();
            $table->boolean('Responded')->default(false);
            $table->boolean('Meeting_Booked')->default(false);
            $table->date('Meeting_Date')->nullable();
            $table->boolean('Meeting_Held')->default(false);
            $table->string('Service_Offered')->nullable();
            $table->text('Remarks')->nullable();
            $table->boolean('Deal_Closed')->default(false);
            $table->decimal('Deal_Value', 15, 2)->nullable();
            
            $table->timestamps();

            $table->foreign('Batch_ID')->references('Batch_ID')->on('assignment_batches')->onDelete('cascade');
            $table->foreign('Lead_ID')->references('Lead_ID')->on('leads')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_leads');
    }
};
