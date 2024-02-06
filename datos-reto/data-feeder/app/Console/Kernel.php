<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        // Otros comandos...
        \App\Console\Commands\EltiempoCommand::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        // $schedule->call(["App\Http\Controllers\DataFeederController@fetchEltiempoProvincias"])->everyFifteenSeconds();

        // $schedule->command('app:eltiempo-command')->everyFifteenMinutes();
        // $schedule->command('app:euskalmet-command')->everyFifteenMinutes();
        // $schedule->command('app:locations-euskalmet-command')->everyFifteenMinutes();
        // $schedule->command('app:location-command')->everyFifteenMinutes();
        
        $schedule->command('app:measurement-history-command')->everyFifteenMinutes();
        $schedule->command('app:generate-random-data')->everyFifteenSeconds();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
