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
            $table->foreignId('recurrent_transaction_id')
                ->nullable()
                ->after('user_id')
                ->constrained('recurrent_transactions')
                ->nullOnDelete();

            $table->unique(['recurrent_transaction_id', 'date'], 'transactions_recurrent_date_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropUnique('transactions_recurrent_date_unique');
            $table->dropConstrainedForeignId('recurrent_transaction_id');
        });
    }
};
