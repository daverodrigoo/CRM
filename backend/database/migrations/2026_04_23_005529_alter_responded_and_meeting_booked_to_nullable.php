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
            $table->boolean('Responded')->nullable()->default(null)->change();
            $table->boolean('Meeting_Booked')->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->boolean('Responded')->nullable(false)->default(false)->change();
            $table->boolean('Meeting_Booked')->nullable(false)->default(false)->change();
        });
    }
};
