<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Artisan;
use App\Services\RecurrentTransactionGenerator;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('recurrents:generate', function (RecurrentTransactionGenerator $generator) {
    $generated = $generator->generateDue();
    $this->info("Generated {$generated} recurrent transactions.");
})->purpose('Generate due recurrent transactions');

Schedule::command('recurrents:generate')->dailyAt('02:00')->withoutOverlapping();
