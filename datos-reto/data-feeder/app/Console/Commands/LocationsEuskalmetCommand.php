<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\DataFeederController;

class LocationsEuskalmetCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:locations-euskalmet-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $data_feeder_controller = new DataFeederController();
        $data_feeder_controller->fetchEuskalmetRegionesZonasLocations();

        $this->info('Comando LocationsEuskalmet ejecutado exitosamente!');
    }
}
