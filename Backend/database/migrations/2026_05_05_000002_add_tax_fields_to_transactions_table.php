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
        Schema::table('transactions', function (Blueprint $table) {
            $table->boolean('is_deductible')->default(false)->after('recurrent_timer');
            $table->decimal('deductible_percent', 5, 2)->nullable()->after('is_deductible');
            $table->string('tax_note')->nullable()->after('deductible_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['is_deductible', 'deductible_percent', 'tax_note']);
        });
    }
};
