<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->unsignedBigInteger('Assigned_By')->nullable()->after('Meeting_Assigned_to');
            
            // Link it to the users table so we know exactly who it is
            $table->foreign('Assigned_By')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->dropForeign(['Assigned_By']);
            $table->dropColumn('Assigned_By');
        });
    }
};