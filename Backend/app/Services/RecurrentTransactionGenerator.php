<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\RecurrentTransaction;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RecurrentTransactionGenerator
{
    public function generateDue(?int $userId = null, ?Carbon $dueThrough = null): int
    {
        $generated = 0;
        $dueThrough ??= Carbon::today();

        $recurrentTransactions = RecurrentTransaction::where('active', true)
            ->when($userId !== null, fn ($query) => $query->where('user_id', $userId))
            ->whereDate('next_run_date', '<=', $dueThrough->toDateString())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereColumn('next_run_date', '<=', 'end_date');
            })
            ->orderBy('next_run_date')
            ->get();

        foreach ($recurrentTransactions as $recurrentTransaction) {
            while (
                $recurrentTransaction->active
                && $recurrentTransaction->next_run_date->lte($dueThrough)
                && (!$recurrentTransaction->end_date || $recurrentTransaction->next_run_date->lte($recurrentTransaction->end_date))
            ) {
                $transaction = $this->generateNext($recurrentTransaction, $dueThrough);
                if (!$transaction) {
                    break;
                }

                $recurrentTransaction->refresh();
                $generated++;
            }
        }

        return $generated;
    }

    public function generateNext(RecurrentTransaction $recurrentTransaction, ?Carbon $dueThrough = null): ?Transaction
    {
        return DB::transaction(function () use ($recurrentTransaction, $dueThrough) {
            $recurrentTransaction = RecurrentTransaction::whereKey($recurrentTransaction->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($dueThrough && $recurrentTransaction->next_run_date->gt($dueThrough)) {
                return null;
            }

            $generationDate = $recurrentTransaction->next_run_date->toDateString();
            $transaction = Transaction::where('recurrent_transaction_id', $recurrentTransaction->id)
                ->whereDate('date', $generationDate)
                ->first();

            if (!$transaction) {
                $bill = $recurrentTransaction->creates_bill
                    ? $this->createBill($recurrentTransaction, $generationDate)
                    : null;

                $transaction = Transaction::create([
                    'user_id' => $recurrentTransaction->user_id,
                    'bill_id' => $bill?->id,
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
                ]);
            } elseif ($recurrentTransaction->creates_bill && !$transaction->bill_id) {
                $bill = $this->createBill($recurrentTransaction, $generationDate);
                $transaction->update(['bill_id' => $bill->id]);
            }

            $nextRunDate = $this->nextRunDate($recurrentTransaction->next_run_date, $recurrentTransaction->frequency);
            $shouldPause = $recurrentTransaction->end_date && Carbon::parse($nextRunDate)->gt($recurrentTransaction->end_date);

            $recurrentTransaction->update([
                'next_run_date' => $nextRunDate,
                'last_generated_at' => now(),
                'active' => $shouldPause ? false : $recurrentTransaction->active,
            ]);

            return $transaction;
        });
    }

    private function createBill(RecurrentTransaction $recurrentTransaction, string $generationDate): Bill
    {
        return Bill::create([
            'user_id' => $recurrentTransaction->user_id,
            'category_id' => $recurrentTransaction->category_id,
            'name' => $recurrentTransaction->name,
            'date' => $generationDate,
            'type' => $recurrentTransaction->type === 'income' ? 'emitida' : 'recibida',
            'total_amount' => $recurrentTransaction->total_amount,
            'iva_percent' => $recurrentTransaction->iva_percent ?? 0,
            'client' => $recurrentTransaction->client,
            'description' => $recurrentTransaction->description,
            'payment_method' => $recurrentTransaction->payment_method,
            'plazos' => null,
        ]);
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
