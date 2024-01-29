<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Eltiempo;
use App\Models\Euskalmet;
use App\Models\LocationsEuskalmet;

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
        /*
        1.fetch con el province_code de la tabla Eltiempos
        2.conseguir los 5 primeros digitos del CODIGOINE de municpio
        3.hacer fetch de el muncipio y recoger latitud, longitud y nombre e insertar en tabla
        */
        $eltiempo_data = Eltiempo::all();

        foreach($eltiempo_data as $provincia){
            print_r($provincia['province_code']);

            $eltiempoURL = 'https://www.el-tiempo.net/api/json/v2/provincias/' . $province_code . '';

            $response = json_decode(@file_get_contents($eltiempoURL), true);

            $arrayProvincias = $response['provincias'];
        }

    }   

}