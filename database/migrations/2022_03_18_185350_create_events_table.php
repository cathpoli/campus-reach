<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id('event_id');
            $table->bigInteger('teacher_id');
            $table->bigInteger('student_id');
            $table->bigInteger('schedule_id');
            $table->string('title');
            $table->string('zoom_meeting_id', 500)->nullable();
            $table->string('zoom_link', 500)->nullable();
            $table->string('status');
            $table->longText('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
