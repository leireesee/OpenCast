<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Euskalmet extends Model
{
    use HasFactory, Notifiable;

    public $timestamps = false;

    protected $fillable = [
        'region_code',
        'zone_code',
    ];

    public function locations_euskalmet()
    {
        return $this->hasMany(LocationsEuskalmet::class);
    }
}
