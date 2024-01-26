<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('measurement_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('location_id');
            $table->string('description');
            $table->date('date');
            $table->time('hour');
            $table->float('temperature');
            $table->float('max_temperature');
            $table->float('min_temperature');
            $table->float('humidity');
            $table->float('wind_speed');
            $table->string('wind_direction');
            $table->float('precipitation');
            $table->time('sunrise');
            $table->time('sunset');
            /*FOREIGN KEYS*/
            $table->foreign('location_id')->references('id')->on('locations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measurement_histories');
    }
};
