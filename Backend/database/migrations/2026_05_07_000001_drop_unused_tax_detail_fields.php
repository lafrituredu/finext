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
            $columns = array_values(array_filter([
                Schema::hasColumn('transactions', 'is_deductible') ? 'is_deductible' : null,
                Schema::hasColumn('transactions', 'deductible_percent') ? 'deductible_percent' : null,
                Schema::hasColumn('transactions', 'tax_note') ? 'tax_note' : null,
            ]));

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });

        Schema::table('recurrent_transactions', function (Blueprint $table) {
            $columns = array_values(array_filter([
                Schema::hasColumn('recurrent_transactions', 'is_deductible') ? 'is_deductible' : null,
                Schema::hasColumn('recurrent_transactions', 'deductible_percent') ? 'deductible_percent' : null,
                Schema::hasColumn('recurrent_transactions', 'tax_note') ? 'tax_note' : null,
            ]));

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'is_deductible')) {
                $table->boolean('is_deductible')->default(false)->after('recurrent_timer');
            }

            if (!Schema::hasColumn('transactions', 'deductible_percent')) {
                $table->decimal('deductible_percent', 5, 2)->nullable()->after('is_deductible');
            }

            if (!Schema::hasColumn('transactions', 'tax_note')) {
                $table->string('tax_note')->nullable();
            }
        });

        Schema::table('recurrent_transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('recurrent_transactions', 'is_deductible')) {
                $table->boolean('is_deductible')->default(false)->after('active');
            }

            if (!Schema::hasColumn('recurrent_transactions', 'deductible_percent')) {
                $table->decimal('deductible_percent', 5, 2)->nullable()->after('is_deductible');
            }

            if (!Schema::hasColumn('recurrent_transactions', 'tax_note')) {
                $table->string('tax_note')->nullable();
            }
        });
    }
};
