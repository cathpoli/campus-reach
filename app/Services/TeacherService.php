<?php

namespace App\Services;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherService
{
    /**
     * Get paginated list of teachers with their profiles.
     */
    public function getTeachersPaginated($perPage = 10)
    {
        return User::with('profile')
            ->where('role', 'teacher')
            ->paginate($perPage)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'full_name' => $user->profile ? trim("{$user->profile->first_name} {$user->profile->last_name}") : 'N/A',
                    'email' => $user->email,
                    'employee_number' => $user->profile?->employee_number ?? 'N/A',
                    'contact_number' => $user->profile?->contact_number ?? 'N/A',
                    'status' => $user->status,
                ];
            });
    }

    /**
     * Get a teacher by ID with profile.
     */
    public function getTeacherById($id)
    {
        return User::with('profile')->findOrFail($id);
    }

    /**
     * Create a new teacher with profile.
     */
    public function createTeacher(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'status' => 'Active',
            ]);

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'extension' => $data['extension'] ?? null,
                'employee_number' => $data['employee_number'],
                'contact_number' => $data['contact_number'],
                'gender' => $data['gender'],
            ]);

            return $user;
        });
    }

    /**
     * Update an existing teacher and profile.
     */
    public function updateTeacher($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $teacher = $this->getTeacherById($id);

            // Update user
            $teacher->update([
                'email' => $data['email'],
            ]);

            // Update profile
            if ($teacher->profile) {
                $teacher->profile->update([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'middle_name' => $data['middle_name'] ?? null,
                    'extension' => $data['extension'] ?? null,
                    'employee_number' => $data['employee_number'],
                    'contact_number' => $data['contact_number'],
                    'gender' => $data['gender'],
                ]);
            }

            return $teacher;
        });
    }

    /**
     * Delete a teacher and their profile.
     */
    public function deleteTeacher($id)
    {
        return DB::transaction(function () use ($id) {
            $teacher = $this->getTeacherById($id);

            // Delete from profiles table
            if ($teacher->profile) {
                $teacher->profile->delete();
            }

            // Delete from users table
            $teacher->delete();
            return true;
        });
    }
}
