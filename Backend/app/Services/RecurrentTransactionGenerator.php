<?php

namespace App\Services;

use App\Models\RecurrentTransaction;
use App\Models\Transaction;
use Carbon\Carbon;

class RecurrentTransactionGenerator
{
    public function generateNext(RecurrentTransaction $recurrentTransaction): Transaction
    {
        $generationDate = $recurrentTransaction->next_run_date->toDateString();
        $transaction = Transaction::where('recurrent_transaction_id', $recurrentTransaction->id)
            ->whereDate('date', $generationDate)
            ->first();

        if (!$transaction) {
            $transaction = Transaction::create([
            'user_id' => $recurrentTransaction->user_id,
            'category_id' => $recurrentTransaction->category_id,
            'recurrent_transaction_id' => $recurrentTransaction->id,
            'name' => $recurrentTransaction->name,
            'date' => $generationDate,
            'type' => $recurrentTransaction->type,
            'total_amount' => $recurrentTransaction->total_amount,
            'iva_percent' => $recurrentTransaction->iva_percent ?? 0,
            'client' => $recurrentTransaction->client,
            'description' => $recurrentTransaction->description,
            'payment_method' => $recurrentTransaction->payment_method,
            'status' => true,
            'recurrent' => true,
            'recurrent_timer' => $recurrentTransaction->frequency,
            'is_deductible' => $recurrentTransaction->is_deductible && ($recurrentTransaction->iva_percent ?? 0) > 0,
            'deductible_percent' => $recurrentTransaction->is_deductible && ($recurrentTransaction->iva_percent ?? 0) > 0 ? $recurrentTransaction->iva_percent : null,
            'tax_note' => null,
            ]);
        }

        $nextRunDate = $this->nextRunDate($recurrentTransaction->next_run_date, $recurrentTransaction->frequency);
        $shouldPause = $recurrentTransaction->end_date && Carbon::parse($nextRunDate)->gt($recurrentTransaction->end_date);

        $recurrentTransaction->update([
            'next_run_date' => $nextRunDate,
            'last_generated_at' => now(),
            'active' => $shouldPause ? false : $recurrentTransaction->active,
        ]);

        return $transaction;
    }

    public function nextRunDate(Carbon $date, string $frequency): string
    {
        return match ($frequency) {
            'weekly' => $date->copy()->addWeek()->toDateString(),
            'quarterly' => $date->copy()->addMonthsNoOverflow(3)->toDateString(),
            'yearly' => $date->copy()->addYearNoOverflow()->toDateString(),
            default => $date->copy()->addMonthNoOverflow()->toDateString(),
        };
    }
}
