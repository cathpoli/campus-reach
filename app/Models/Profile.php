<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $primaryKey = 'profile_id';

    protected $fillable = [
        'user_id',
        'honorifics',
        'first_name',
        'last_name',
        'middle_name',
        'extension',
        'student_number',
        'employee_number',
        'address',
        'contact_number',
        'birthday',
        'gender',
        'avatar',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
