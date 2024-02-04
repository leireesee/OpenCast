<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class Euskalmet extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'region_code',
        'zone_code',
    ];

    public function locations_euskalmet()
    {
        return $this->hasMany(LocationsEuskalmet::class);
    }
}
