<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\MeasurementHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use DateTime;

class FakeDataFeederController extends Controller
{
    /*1 Entrada fake*/
    public function datos(){
        $possibleDescriptions = 
            [
                'Despejado' => '11',
                'Despejado noche' => '11n',
                'Poco nuboso' => '12',
                'Poco nuboso noche' => '12n',
                'Intervalos nubosos' => '13',
                'Intervalos nubosos noche' => '13n',
                'Nuboso' => '14',
                'Nuboso noche' => '14n',
                'Muy nuboso' => '15',
                'Cubierto' => '16',
                'Nubes altas' => '16',
                'Nubes altas noche' => '16n',
                'Intervalos nubosos con lluvia escasa' => '43',
                'Intervalos nubosos con lluvia escasa noche' => '43n',
                'Nuboso con lluvia escasa' => '44',
                'Nuboso con lluvia escasa noche' => '44n',
                'Muy nuboso con lluvia escasa' => '45',
                'Cubierto con lluvia escasa' => '46',
                'Intervalos nubosos con lluvia' => '23',
                'Intervalos nubosos con lluvia noche' => '23n',
                'Nuboso con lluvia' => '24',
                'Nuboso con lluvia noche' => '24n',
                'Muy nuboso con lluvia' => '25',
                'Cubierto con lluvia' => '26',
                'Intervalos nubosos con nieve escasa' => '71',
                'Intervalos nubosos con nieve escasa noche' => '71n',
                'Nuboso con nieve escasa' => '72',
                'Nuboso con nieve escasa noche' => '72n',
                'Muy nuboso con nieve escasa' => '73',
                'Cubierto con nieve escasa' => '74',
                'Intervalos nubosos con nieve' => '33',
                'Intervalos nubosos con nieve noche' => '33n',
                'Nuboso con nieve' => '34',
                'Nuboso con nieve noche' => '34n',
                'Muy nuboso con nieve' => '35',
                'Cubierto con nieve' => '36',
                'Intervalos nubosos con tormenta' => '51',
                'Intervalos nubosos con tormenta noche' => '51n',
                'Nuboso con tormenta' => '52',
                'Nuboso con tormenta noche' => '52n',
                'Muy nuboso con tormenta' => '53',
                'Cubierto con tormenta' => '54',
                'Intervalos nubosos con tormenta y lluvia escasa' => '61',
                'Intervalos nubosos con tormenta y lluvia escasa noche' => '61n',
                'Nuboso con tormenta y lluvia escasa' => '62',
                'Nuboso con tormenta y lluvia escasa noche' => '62n',
                'Muy nuboso con tormenta y lluvia escasa' => '63',
                'Cubierto con tormenta y lluvia escasa' => '64',
                'Niebla' => '81',
                'Bruma' => '82',
                'Calima' => '83'
            ];

        $fakeDescription = array_rand($possibleDescriptions); 
        $fakeTemperature = rand(-10, 50);
        $fakeMaxTemperature = rand($fakeTemperature, 50);
        $fakeMinTemperature = rand(-10, $fakeTemperature);
        $fakeHumidity = rand(0, 100);    

    }

    function generateRandomData(){

        $locations_data = Location::all();
        $data =  array();
        foreach ($locations_data as $location){
            $measurement_data = MeasurementHistory::where(
                'location_id', '=', $location['id'] 
            )->orderBy('date', 'desc')->orderBy('hour', 'desc')->first();
            array_push($data,$measurement_data);
        }

        $seconds = intval(date('s'));

        foreach($data as $dato){
            if($seconds % 2 == 0){
                $cont = 1;
            } else {
                $cont = -1;
            }

            $temperaturaActual = $dato->temperature;
            $tempMax = $dato->max_temperature;
            $tempMin = $dato->min_temperature;

            //generar las temperaturas segun temp maxima y temp minima
            if($temperaturaActual + 1 > $tempMax){
                $temperaturaActual = $temperaturaActual - 1;
            } else if ($temperaturaActual - 1 < $tempMin) {
                $temperaturaActual = $temperaturaActual + 1;

            } else {
                $temperaturaActual = $temperaturaActual + $cont;
            }           

            //insertamos en la base de datos los datos inventados
            MeasurementHistory::create([
                'location_id' => $dato->location_id,
                'description' => $dato->description,
                'date'=> Carbon::now('GMT+1')->toDateString(),
                'hour'=> Carbon::now('GMT+1')->toTimeString(),
                'temperature' => $temperaturaActual,
                'max_temperature' => $dato->max_temperature,
                'min_temperature' => $dato->min_temperature,
                'humidity'=> $dato->humidity +($dato->humidity == 0 ? 1:$cont),
                'wind_speed'=> $dato->wind_speed +($dato->wind_speed == 0 ? 1:$cont),
                'wind_direction' => $dato->wind_direction,
                'precipitation' => $dato->precipitation,
                'sunrise' => $dato->sunrise,
                'sunset' =>  $dato->sunset,
            ]);

        }
        
    }


    // public function generateLastYearData(){
    //     // $possibleDescriptions = 
    //     //     [
    //     //         'Despejado' => '11',
    //     //         'Despejado noche' => '11n',
    //     //         'Poco nuboso' => '12',
    //     //         'Poco nuboso noche' => '12n',
    //     //         'Intervalos nubosos' => '13',
    //     //         'Intervalos nubosos noche' => '13n',
    //     //         'Nuboso' => '14',
    //     //         'Nuboso noche' => '14n',
    //     //         'Muy nuboso' => '15',
    //     //         'Cubierto' => '16',
    //     //         'Nubes altas' => '16',
    //     //         'Nubes altas noche' => '16n',
    //     //         'Intervalos nubosos con lluvia escasa' => '43',
    //     //         'Intervalos nubosos con lluvia escasa noche' => '43n',
    //     //         'Nuboso con lluvia escasa' => '44',
    //     //         'Nuboso con lluvia escasa noche' => '44n',
    //     //         'Muy nuboso con lluvia escasa' => '45',
    //     //         'Cubierto con lluvia escasa' => '46',
    //     //         'Intervalos nubosos con lluvia' => '23',
    //     //         'Intervalos nubosos con lluvia noche' => '23n',
    //     //         'Nuboso con lluvia' => '24',
    //     //         'Nuboso con lluvia noche' => '24n',
    //     //         'Muy nuboso con lluvia' => '25',
    //     //         'Cubierto con lluvia' => '26',
    //     //         'Intervalos nubosos con nieve escasa' => '71',
    //     //         'Intervalos nubosos con nieve escasa noche' => '71n',
    //     //         'Nuboso con nieve escasa' => '72',
    //     //         'Nuboso con nieve escasa noche' => '72n',
    //     //         'Muy nuboso con nieve escasa' => '73',
    //     //         'Cubierto con nieve escasa' => '74',
    //     //         'Intervalos nubosos con nieve' => '33',
    //     //         'Intervalos nubosos con nieve noche' => '33n',
    //     //         'Nuboso con nieve' => '34',
    //     //         'Nuboso con nieve noche' => '34n',
    //     //         'Muy nuboso con nieve' => '35',
    //     //         'Cubierto con nieve' => '36',
    //     //         'Intervalos nubosos con tormenta' => '51',
    //     //         'Intervalos nubosos con tormenta noche' => '51n',
    //     //         'Nuboso con tormenta' => '52',
    //     //         'Nuboso con tormenta noche' => '52n',
    //     //         'Muy nuboso con tormenta' => '53',
    //     //         'Cubierto con tormenta' => '54',
    //     //         'Intervalos nubosos con tormenta y lluvia escasa' => '61',
    //     //         'Intervalos nubosos con tormenta y lluvia escasa noche' => '61n',
    //     //         'Nuboso con tormenta y lluvia escasa' => '62',
    //     //         'Nuboso con tormenta y lluvia escasa noche' => '62n',
    //     //         'Muy nuboso con tormenta y lluvia escasa' => '63',
    //     //         'Cubierto con tormenta y lluvia escasa' => '64',
    //     //         'Niebla' => '81',
    //     //         'Bruma' => '82',
    //     //         'Calima' => '83'
    //     //     ];

    //     // $fakeDescription = array_rand($possibleDescriptions); 
    //     // $fakeTemperature = rand(-10, 50);
    //     // $fakeMaxTemperature = rand($fakeTemperature, 50);
    //     // $fakeMinTemperature = rand(-10, $fakeTemperature);
    //     // $fakeHumidity = rand(0, 100);

    //     // Las dos fechas que voy a recorrer
    //     $actualDate = new DateTime(Carbon::now('GMT+1'));
    //     $lastYearDate = clone $actualDate;
    //     $lastYearDate = $lastYearDate->modify('-1 year');

    //     // Creo el intervalo y especifico que será de uno al dia (P1D)
    //     $dateInterval = new DateInterval('P1D');

    //     // Creo el iterador de fechas y lo recorro
    //     $dateIterator = new DatePeriod($actualDate, $dateInterval, $lastYearDate, 0);

    //     foreach ($dateIterator as $day) {
    //         Log::info($day);
    //     }
        

    // }
    
}
