<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class MeasurementHistory extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'location_name',
        'description',
        'date',
        'hour',
        'temperature',
        'max_temperature',
        'min_temperature',
        'humidity',
        'wind_speed',
        'wind_direction',
        'precipitation',
        
    ];
}
