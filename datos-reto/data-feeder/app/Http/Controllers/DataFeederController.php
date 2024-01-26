<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Eltiempo;

class DataFeederController extends Controller
{
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

    public function fetchEuskalmetRegionesZonas()
    {
        $euskalmetURL = 'https://api.sandbox.euskadi.eus/euskalmet/geo/regions/basque_country/zones';

        $response = json_decode(@file_get_contents($euskalmetURL), true);

        $arrayZonas = $response['zonas'];

        foreach($arrayZonas as $zonas) {
            $euskalmet = new Euskalmet();
            $euskalmet->region_code = $region['regionId'];
            $euskalmet->zone_code = $region['regionZoneId'];
            $eltiempo->save();
        }

    }
}
