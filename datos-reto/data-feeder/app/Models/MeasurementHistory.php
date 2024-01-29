<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class MeasurementHistory extends Model
{
    use HasFactory, Notifiable;

    public $timestamps = false;

    protected $fillable = [
        'location_id',
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
        'sunrise',
        'sunset'
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
