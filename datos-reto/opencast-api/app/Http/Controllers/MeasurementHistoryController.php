<?php

namespace App\Http\Controllers;

use App\Models\MeasurementHistory;
use App\Models\Location;
use Illuminate\Http\Request;

class MeasurementHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations_data = Location::all();
        $data =  array();
        $completeData = array();
        foreach ($locations_data as $location){
            $measurement_data = MeasurementHistory::where(
                'location_id', '=', $location['id'] 
            )->orderBy('date', 'desc')->first();
            array_push($data,$measurement_data);
        }

        array_push($completeData, $locations_data);
        array_push($completeData, $data);

        return $completeData;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(MeasurementHistory $measurementHistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MeasurementHistory $measurementHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MeasurementHistory $measurementHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MeasurementHistory $measurementHistory)
    {
        //
    }
}
