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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('latitude');
            $table->string('longitude');
            $table->unsignedBigInteger('id_locations_euskalmet');
            $table->unsignedBigInteger('id_eltiempo');
            $table->string('municipality_code_eltiempo'); /*codigo provincia*/
            /*FOREIGN KEYS*/
            $table->foreign('id_eltiempo')->references('id')->on('eltiempos');
            $table->foreign('id_locations_euskalmet')->references('id')->on('locations_euskalmets');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
