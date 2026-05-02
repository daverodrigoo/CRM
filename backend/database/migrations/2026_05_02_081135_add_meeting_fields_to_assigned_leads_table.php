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
            // Check if column exists before adding to prevent crashes
            if (!Schema::hasColumn('assigned_leads', 'Admin_Notes')) {
                $table->text('Admin_Notes')->nullable();
            }
            if (!Schema::hasColumn('assigned_leads', 'Meeting_Completed')) {
                // Using boolean because checkboxes are true/false
                $table->boolean('Meeting_Completed')->default(false)->nullable();
            }
            if (!Schema::hasColumn('assigned_leads', 'Deal_Closed')) {
                // Using boolean because Deal Closed is a Yes/No (True/False) toggle
                $table->boolean('Deal_Closed')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('assigned_leads', function (Blueprint $table) {
            $table->dropColumn(['Admin_Notes', 'Meeting_Completed', 'Deal_Closed']);
        });
    }
};
