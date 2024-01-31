<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\DataFeederController;

class EltiempoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:eltiempo-command';

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
        $data_feeder_controller->fetchEltiempoProvincias();

        $this->info('Comando Eltiempo ejecutado exitosamente!');
    }
}
