<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Euskalmet
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'region_code',
        'zone_code',
        'name'
    ];

    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
