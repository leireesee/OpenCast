<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class LocationsEuskalmet extends Model
{
    use HasFactory, Notifiable;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'id_euskalmet'
    ];

    public function locations()
    {
        return $this->hasOne(Location::class);
    }

    public function euskalmets()
    {
        return $this->belongsTo(Euskalmet::class);
    }

}

