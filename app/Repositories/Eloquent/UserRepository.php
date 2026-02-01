<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function findById($id)
    {
        return $this->model->with('profile')->find($id);
    }

    public function getUserListByRole($role)
    {
        return $this->model->where('role', $role)
            ->where('status', 'active')
            ->with('profile')
            ->get();
    }

    public function updateProfile($userId, array $data)
    {
        $user = $this->findById($userId);
        if (!$user) {
            return false;
        }

        // Update user fields
        $user->email = $data['email'] ?? $user->email;
        $user->save();

        // Update profile fields
        $profileData = [
            'first_name' => $data['first_name'] ?? $user->profile->first_name,
            'last_name' => $data['last_name'] ?? $user->profile->last_name,
            'middle_name' => $data['middle_name'] ?? $user->profile->middle_name,
            'extension' => $data['extension'] ?? $user->profile->extension,
            'student_number' => $data['student_number'] ?? $user->profile->student_number,
            'employee_number' => $data['employee_number'] ?? $user->profile->employee_number,
            'contact_number' => $data['contact_number'] ?? $user->profile->contact_number,
            'gender' => $data['gender'] ?? $user->profile->gender,
        ];
        $user->profile()->update($profileData);

        return $user->fresh();
    }
}