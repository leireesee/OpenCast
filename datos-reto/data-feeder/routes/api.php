<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DataFeederController;
use App\Http\Controllers\FakeDataFeederController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*Alimentacion tabla ELTIEMPO*/
Route::get('/eltiempo', [DataFeederController::class, 'fetchEltiempoProvincias']);

/*Alimentacion tabla EUSKALMET*/
Route::get('/euskalmet', [DataFeederController::class, 'fetchEuskalmetRegionesZonas']);

/*Alimentacion tabla LOCATIONS EUSKALMET*/
Route::get('/euskalmet_locations', [DataFeederController::class, 'fetchEuskalmetRegionesZonasLocations']);

/*Alimentacion tabla LOCATIONS*/
Route::get('/locations', [DataFeederController::class, 'fetchLocations']);

/*Alimentacion tabla LOCATION HISTORIES*/
Route::get('/locations_histories', [DataFeederController::class, 'fetchLocationHistories']);



/*Generacion de datos aleatorios*/
Route::get('/last_data', [FakeDataFeederController::class, 'generateRandomData']);

/*Generacion de datos aleatorios ultimo año*/
// Route::get('/last_year_data', [FakeDataFeederController::class, 'generateLastYearData']);