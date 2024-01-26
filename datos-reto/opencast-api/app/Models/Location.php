<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;


class Location extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'id_euskalmet',
        'id_eltiempo',
        'municipality_code_eltiempo'
    ];
    
    public function euskalmet()
    {
        return $this->belongsTo(Euskalmet::class);
    }
    public function eltiempo()
    {
        return $this->belongsTo(Eltiempo::class);
    }

    public function measurementHistories()
    {
        return $this->hasMany(MeasurementHistory::class);
    }
}
