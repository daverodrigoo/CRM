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
            $table->string('Point_of_Contact')->nullable()->after('Responded');
        });
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->dropColumn('Point_of_Contact');
        });
    }
    
};
