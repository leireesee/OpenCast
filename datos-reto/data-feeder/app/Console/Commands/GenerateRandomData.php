<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\FakeDataFeederController;

class GenerateRandomData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-random-data';

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
        $fake_data_feeder_controller = new FakeDataFeederController();
        $fake_data_feeder_controller->generateRandomData();

        $this->info('Comando GenerateRandomData ejecutado exitosamente!');
    }
}
