<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            // Makes the column nullable so it can be blank/null
            $table->string('Deal_Closed')->nullable()->change();
        });

        // Sets existing "No" values to null to fix the "default No" UI issue
        DB::table('assigned_leads')->update(['Deal_Closed' => null]);
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->string('Deal_Closed')->nullable(false)->change();
        });
    }
};
