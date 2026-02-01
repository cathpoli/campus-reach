<?php

namespace App\Services;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class StudentService
{
    /**
     * Get paginated list of students with their profiles.
     */
    public function getStudentsPaginated($perPage = 10)
    {
        return User::with('profile')
            ->where('role', 'student')
            ->paginate($perPage)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'full_name' => $user->profile ? trim("{$user->profile->first_name} {$user->profile->last_name}") : 'N/A',
                    'email' => $user->email,
                    'student_number' => $user->profile?->student_number ?? 'N/A',
                    'contact_number' => $user->profile?->contact_number ?? 'N/A',
                    'status' => $user->status,
                ];
            });
    }

    /**
     * Get a student by ID with profile.
     */
    public function getStudentById($id)
    {
        return User::with('profile')->findOrFail($id);
    }

    /**
     * Create a new student with profile.
     */
    public function createStudent(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => 'student',
                'status' => 'Active',
            ]);

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'extension' => $data['extension'] ?? null,
                'student_number' => $data['student_number'],
                'contact_number' => $data['contact_number'],
                'gender' => $data['gender'],
            ]);

            return $user;
        });
    }

    /**
     * Update an existing student and profile.
     */
    public function updateStudent($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $student = $this->getStudentById($id);

            // Update user
            $student->update([
                'email' => $data['email'],
            ]);

            // Update profile
            if ($student->profile) {
                $student->profile->update([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'middle_name' => $data['middle_name'] ?? null,
                    'extension' => $data['extension'] ?? null,
                    'student_number' => $data['student_number'],
                    'contact_number' => $data['contact_number'],
                    'gender' => $data['gender'],
                ]);
            }

            return $student;
        });
    }

    /**
     * Delete a student and their profile.
     */
    public function deleteStudent($id)
    {
        return DB::transaction(function () use ($id) {
            $student = $this->getStudentById($id);

            // Delete from profiles table
            if ($student->profile) {
                $student->profile->delete();
            }

            // Delete from users table
            $student->delete();

            return true;
        });
    }
    
}
