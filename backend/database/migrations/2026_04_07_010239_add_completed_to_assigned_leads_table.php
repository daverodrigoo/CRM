<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->boolean('Completed')->default(false)->after('Meeting_Booked');
        });
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->dropColumn('Completed');
        });
    }
};
