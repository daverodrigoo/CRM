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
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->time('Meeting_Time')->nullable()->after('Meeting_Date');
        });
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->dropColumn('Meeting_Time');
        });
    }
};
