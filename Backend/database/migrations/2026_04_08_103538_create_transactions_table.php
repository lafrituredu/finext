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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('transaction_categories')->cascadeOnDelete();

            $table->string('name');
            $table->date('date');
            $table->enum('type', ['income', 'expense']);

            $table->decimal('total_amount', 10, 2);
            $table->decimal('iva_percent', 5, 2)->nullable();

            $table->string('client')->nullable();
            $table->text('description')->nullable();
            $table->string('payment_method')->nullable();

            $table->boolean('status')->default(true);
            $table->boolean('recurrent')->default(false);
            $table->string('recurrent_timer')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
