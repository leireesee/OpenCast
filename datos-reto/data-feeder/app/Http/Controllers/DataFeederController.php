<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Eltiempo;
use App\Models\Euskalmet;
use App\Models\LocationsEuskalmet;
use App\Models\Location;
use App\Models\MeasurementHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DataFeederController extends Controller
{
    /*Alimentacion tabla ELTIEMPO*/
    public function fetchEltiempoProvincias()
    {
        $eltiempoURL = 'https://www.el-tiempo.net/api/json/v2/provincias';

        $response = json_decode(@file_get_contents($eltiempoURL), true);

        $arrayProvincias = $response['provincias'];

        foreach($arrayProvincias as $provincia) {
            $eltiempo = new Eltiempo(); 
            $eltiempo->province_code = $provincia['CODPROV'];
            $eltiempo->name = $provincia['NOMBRE_PROVINCIA'];
            $eltiempo->save();
        }
    }

    /*Alimentacion tabla EUSKALMET*/
    public function fetchEuskalmetRegionesZonas()
    {
        $euskalmetURL1 = 'https://api.euskadi.eus/euskalmet/geo/regions';

        $token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE2Mzk3NDc5MDcsImVtYWlsIjoiaWtjZmNAcGxhaWF1bmRpLm5ldCJ9.PwlkDxwtidWSjLo81yRgf6vITaU5yGDH1TgXAVf5Ijl07Bz8auOyQX3uMGiC8GhGiHHymNDBK1IoM3C1aeasdGngQsAMoS9jbiGNGNOhb9JthJnY778zPBxZ6EzlnZEuDFRDGZCRbB4IkyzQk677rP3Nt0v5GPU8g2F4uacpTCWwj0k_fQsCCfhNY89ECGV1pFMwJc_9m7Rezzxd6IMxLyir7MgaWWRGvGb1kH4XqBV_roBBSIO70j4P-p0udoZIuRKWrDZexrSeX9G_brJJplwzoI2eo8mQVX3u3uzn-9E2iystKe0IS3k6uLYiHnNuPQnCkIBUg3JAhu_q9V8iIg';

        $options = [
            'http' => [
                'header' => "Authorization: Bearer $token\r\n",
                'method' => 'GET',
            ],
        ];

        $context = stream_context_create($options);

        $response = json_decode(@file_get_contents($euskalmetURL1, false, $context), true);

        // print_r($response);

        $arrayRegions = $response;

        foreach($arrayRegions as $region) {
            
            // print_r($region['regionId']);

            $euskalmetURL2 = 'https://api.sandbox.euskadi.eus/euskalmet/geo/regions/' . $region['regionId'] . '/zones';

            // print_r($euskalmetURL2);

            $response = json_decode(@file_get_contents($euskalmetURL2), true);
    
            $arrayZones = $response;

            // print_r($response);

            foreach($arrayZones as $zone) {
                $euskalmet = new Euskalmet();
                $euskalmet->region_code = $region['regionId'];
                $euskalmet->zone_code = $zone['regionZoneId'];
                $euskalmet->save();
            }
        }
    }

    /*Alimentacion tabla LOCATIONS EUSKALMET*/
    public function fetchEuskalmetRegionesZonasLocations(){
        $eukalmet_data = Euskalmet::all();

        // print_r($eukalmet_data[0]['id']);

        foreach($eukalmet_data as $zona){

            // print_r($zona['region_code']);

            $euskalmetURL = 'https://api.euskadi.eus/euskalmet/geo/regions/' . $zona['region_code'] . '/zones/' . $zona['zone_code'] . '/locations';

            // print_r($euskalmetURL);

            $token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE2Mzk3NDc5MDcsImVtYWlsIjoiaWtjZmNAcGxhaWF1bmRpLm5ldCJ9.PwlkDxwtidWSjLo81yRgf6vITaU5yGDH1TgXAVf5Ijl07Bz8auOyQX3uMGiC8GhGiHHymNDBK1IoM3C1aeasdGngQsAMoS9jbiGNGNOhb9JthJnY778zPBxZ6EzlnZEuDFRDGZCRbB4IkyzQk677rP3Nt0v5GPU8g2F4uacpTCWwj0k_fQsCCfhNY89ECGV1pFMwJc_9m7Rezzxd6IMxLyir7MgaWWRGvGb1kH4XqBV_roBBSIO70j4P-p0udoZIuRKWrDZexrSeX9G_brJJplwzoI2eo8mQVX3u3uzn-9E2iystKe0IS3k6uLYiHnNuPQnCkIBUg3JAhu_q9V8iIg';

            $options = [
                'http' => [
                    'header' => "Authorization: Bearer $token\r\n",
                    'method' => 'GET',
                ],
            ];

            $context = stream_context_create($options);

            $response = json_decode(@file_get_contents($euskalmetURL, false, $context), true);

            $arrayLocations = $response;

            foreach($arrayLocations as $location){
                $locationsEuskalmet = new LocationsEuskalmet();
                $locationsEuskalmet->name = $location['regionZoneLocationId'];
                $locationsEuskalmet->id_euskalmet = $zona['id'];
                $locationsEuskalmet->save();
            }

        }

    }


    /*Alimentacion tabla LOCATIONS*/
    public function fetchLocations(){
        $eltiempo_data = Eltiempo::all();

        $ciudadesSeleccionadas = [
            'Vitoria-Gasteiz' => 'gasteiz',
            'Irun' => 'irun',
            'Hondarribia' => 'hondarribia',
            'Oiartzun' => 'oiartzun',
            'Donostia/San Sebastián' => 'donostia',
            'Bilbao' => 'bilbao'
        ];

        foreach($eltiempo_data as $provincia){
            
            $eltiempoURL = 'https://www.el-tiempo.net/api/json/v2/provincias/' . $provincia['province_code'] . '/municipios';

            $response = json_decode(@file_get_contents($eltiempoURL), true);

            $arrayMunicipios = $response['municipios'];

            foreach($arrayMunicipios as $municipio) {
                if (!in_array($municipio['NOMBRE'], array_keys($ciudadesSeleccionadas))) continue;

                $locationsEuskalmetJSON = LocationsEuskalmet::where('name', '=', $ciudadesSeleccionadas[$municipio['NOMBRE']])->get();
                
                $locationsEuskalmet = json_decode($locationsEuskalmetJSON, true);
                
                // Log::info($locationsEuskalmetJSON);

                // print_r($municipio["NOMBRE"].' '.$municipio["LATITUD_ETRS89_REGCAN95"].' '.$municipio["LONGITUD_ETRS89_REGCAN95"].' '.$locationsEuskalmet[0]['id']);

                $location = new Location();
                $location->name = $locationsEuskalmet[0]['name']; 
                $location->latitude = $municipio['LATITUD_ETRS89_REGCAN95'];
                $location->longitude = $municipio['LONGITUD_ETRS89_REGCAN95'];
                $location->id_locations_euskalmet = $locationsEuskalmet[0]['id'];
                $location->id_eltiempo = $provincia['id'];
                $location->municipality_code_eltiempo = substr($municipio['CODIGOINE'], 0, 5);
                $location -> save();

            }
            
        }   

    }

    /*Alimentacion tabla LOCATION HISTORIES*/
    public function fetchLocationHistories(){
        $location_data = Location::all();

        foreach($location_data as $location){

            $eltiempo_dataJSON = Eltiempo::where('id', '=', $location['id_eltiempo'])->get();

            $eltiempo_data = json_decode($eltiempo_dataJSON, true);
                        
            $url = 'https://www.el-tiempo.net/api/json/v2/provincias/' .$eltiempo_data[0]['province_code']. '/municipios/' . $location['municipality_code_eltiempo'];

            // print_r($url);

            $response = json_decode(@file_get_contents($url), true);

            // $arrayWeather = $response['temperatura_actual'];

            // print_r($arrayWeather . ' ');

            $direccionViento;
            $velocidadViento;

            $locationHistory = new MeasurementHistory();
            $locationHistory->location_id = $location['id'];
            $locationHistory->description = $response['stateSky']['description'];
            $locationHistory->date = $response['fecha'];
            $locationHistory->hour = Carbon::now()->toTimeString();
            $locationHistory->temperature = $response['temperatura_actual'];
            $locationHistory->max_temperature = $response['temperaturas']['max'];
            $locationHistory->min_temperature = $response['temperaturas']['min'];
            $locationHistory->humidity = $response['humedad'];
            $locationHistory->wind_speed = $response['viento'];
            $periodo = explode(":", Carbon::now()->toTimeString())[0];
            // $locationHistory->wind_direction = $arrayWeather['pronostico']['hoy']['viento'][''];

            $arrayViento = $response['pronostico']['hoy']['viento'];

            foreach($arrayViento as $viento) {
                if($viento['@attributes']['periodo'] == $periodo) {
                    $direccionViento = $viento['direccion'];
                    $velocidadViento = $viento['velocidad'];
                }
            }
            $locationHistory->wind_speed = $velocidadViento;
            $locationHistory->wind_direction = $direccionViento;
            $locationHistory->precipitation = $response['precipitacion'];
            $locationHistory->sunrise = $response['pronostico']['hoy']['@attributes']['orto'];
            $locationHistory->sunset = $response['pronostico']['hoy']['@attributes']['ocaso'];
            //Log::info($locationHistory);
            $locationHistory->save();
            
        }

    }

}