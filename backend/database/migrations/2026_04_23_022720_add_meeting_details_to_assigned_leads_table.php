<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->string('Meeting_Type')->nullable()->after('Meeting_Time');
            $table->unsignedBigInteger('Meeting_Assigned_to')->nullable()->after('Meeting_Type');
            $table->text('Meeting_Notes')->nullable()->after('Meeting_Assigned_to');
        });
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->dropColumn(['Meeting_Type', 'Meeting_Assigned_to', 'Meeting_Notes']);
        });
    }
};