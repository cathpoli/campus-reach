<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $primaryKey = 'schedule_id';

    protected $fillable = [
        'teacher_id',
        'time_schedule_id',
        'date',
        'day',
        'start_date_time',
        'end_date_time',
        'duration',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'start_date_time' => 'datetime',
        'end_date_time' => 'datetime',
    ];

    /**
     * Get the teacher that owns the schedule.
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Alias for user (for backward compatibility).
     */
    public function user()
    {
        return $this->teacher();
    }
}
