<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Artisan;
use App\Models\RecurrentTransaction;
use App\Services\RecurrentTransactionGenerator;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('recurrents:generate', function (RecurrentTransactionGenerator $generator) {
    $generated = 0;
    $today = now()->toDateString();

    $recurrentTransactions = RecurrentTransaction::where('active', true)
        ->whereDate('next_run_date', '<=', $today)
        ->where(function ($query) {
            $query->whereNull('end_date')
                ->orWhereColumn('next_run_date', '<=', 'end_date');
        })
        ->orderBy('next_run_date')
        ->get();

    foreach ($recurrentTransactions as $recurrentTransaction) {
        while (
            $recurrentTransaction->active
            && $recurrentTransaction->next_run_date->lte(now())
            && (!$recurrentTransaction->end_date || $recurrentTransaction->next_run_date->lte($recurrentTransaction->end_date))
        ) {
            $generator->generateNext($recurrentTransaction);
            $recurrentTransaction->refresh();
            $generated++;
        }
    }

    $this->info("Generated {$generated} recurrent transactions.");
})->purpose('Generate due recurrent transactions');

Schedule::command('recurrents:generate')->dailyAt('02:00')->withoutOverlapping();
