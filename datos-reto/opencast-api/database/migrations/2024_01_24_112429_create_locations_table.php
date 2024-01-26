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
            $table->unsignedBigInteger('euskalmet_id');
            $table->string('municipality_code_eltiempo'); /*codigo provincia*/
            $table->unsignedBigInteger('eltiempo_id');
            /*FOREIGN KEYS*/
            $table->foreign('eltiempo_id')->references('id')->on('eltiempos');
            $table->foreign('euskalmet_id')->references('id')->on('euskalmets');
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
