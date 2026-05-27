<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\RecurrentTransaction;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RecurrentTransactionGenerator
{
    // This method creates all recurrent transactions that must run today or before today.
    // If a user id is received, it only checks recurrent transactions for that user.
    // If no date is received, it uses today's date as the limit.
    public function generateDue(?int $userId = null, ?Carbon $dueThrough = null): int
    {
        $generated = 0;
        $dueThrough ??= Carbon::today();

        // Get only active recurrent transactions that are ready to be generated.
        // The next run date must be before or equal to the limit date.
        // If the recurrent transaction has an end date, it must not be expired.
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
            // A recurrent transaction can be late more than one time.
            // For example, a monthly payment can be two months late.
            // This loop creates all missing transactions until it is up to date.
            while (
                $recurrentTransaction->active
                && $recurrentTransaction->next_run_date->lte($dueThrough)
                && (!$recurrentTransaction->end_date || $recurrentTransaction->next_run_date->lte($recurrentTransaction->end_date))
            ) {
                $transaction = $this->generateNext($recurrentTransaction, $dueThrough);
                if (!$transaction) {
                    // If no transaction was created, stop this recurrent transaction.
                    // This can happen when the next run date is after the limit date.
                    break;
                }

                // Reload the model because generateNext updates the next run date.
                $recurrentTransaction->refresh();
                $generated++;
            }
        }

        return $generated;
    }

    // This method creates only the next transaction for one recurrent transaction.
    // It also moves the next run date to the following week, month, quarter, or year.
    public function generateNext(RecurrentTransaction $recurrentTransaction, ?Carbon $dueThrough = null): ?Transaction
    {
        return DB::transaction(function () use ($recurrentTransaction, $dueThrough) {
            // Lock the recurrent transaction while it is being generated.
            // This avoids creating the same transaction twice at the same time.
            $recurrentTransaction = RecurrentTransaction::whereKey($recurrentTransaction->id)
                ->lockForUpdate()
                ->firstOrFail();

            // If a limit date exists and this recurrent transaction is not due yet,
            // do not create anything.
            if ($dueThrough && $recurrentTransaction->next_run_date->gt($dueThrough)) {
                return null;
            }

            $generationDate = $recurrentTransaction->next_run_date->toDateString();

            // Check if the transaction for this recurrent transaction and date already exists.
            // This prevents duplicated transactions.
            $transaction = Transaction::where('recurrent_transaction_id', $recurrentTransaction->id)
                ->whereDate('date', $generationDate)
                ->first();

            if (!$transaction) {
                // If this recurrent transaction must create a bill, create it before the transaction.
                // The transaction will store the bill id.
                $bill = $recurrentTransaction->creates_bill
                    ? $this->createBill($recurrentTransaction, $generationDate)
                    : null;

                // Create the real transaction using the data saved in the recurrent transaction.
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
                // If the transaction already exists but has no bill, create the bill now
                // and connect it to the transaction.
                $bill = $this->createBill($recurrentTransaction, $generationDate);
                $transaction->update(['bill_id' => $bill->id]);
            }

            // Calculate when this recurrent transaction must run again.
            $nextRunDate = $this->nextRunDate($recurrentTransaction->next_run_date, $recurrentTransaction->frequency);

            // If the next run date is after the end date, pause the recurrent transaction.
            $shouldPause = $recurrentTransaction->end_date && Carbon::parse($nextRunDate)->gt($recurrentTransaction->end_date);

            $recurrentTransaction->update([
                'next_run_date' => $nextRunDate,
                'last_generated_at' => now(),
                'active' => $shouldPause ? false : $recurrentTransaction->active,
            ]);

            return $transaction;
        });
    }

    // This method creates a bill from a recurrent transaction.
    // Income transactions create issued bills, and expense transactions create received bills.
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

    // This method returns the next date based on the selected frequency.
    // It uses "NoOverflow" methods to avoid invalid dates.
    // For example, January 31 plus one month becomes February 28 or 29.
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
