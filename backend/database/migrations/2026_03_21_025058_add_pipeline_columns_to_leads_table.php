<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            // Adding the columns required for the Pipeline
            $table->string('Lead_Status')->nullable()->default('New Lead');
            $table->string('Inquiry_Sent')->nullable()->default('No');
            $table->string('Inquiry_Type')->nullable();
            $table->string('Replied')->nullable()->default('No');
            $table->string('Email_Sent')->nullable()->default('No');
            $table->string('Email_Replied')->nullable()->default('No');
            $table->date('Date_Dialed')->nullable();
            $table->text('Pipeline_Remarks')->nullable();
            $table->string('Meeting_Booked')->nullable()->default('No');
        });
    }

    public function down()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn([
                'Lead_Status', 'Inquiry_Sent', 'Inquiry_Type', 'Replied',
                'Email_Sent', 'Email_Replied', 'Date_Dialed', 'Pipeline_Remarks', 'Meeting_Booked'
            ]);
        });
    }
};