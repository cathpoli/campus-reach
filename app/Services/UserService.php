<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get a single data by ID
     */
    public function getUserById($userId)
    {
        return$this->userRepository->findById($userId);
    }

    public function getTeacherList()
    {
        return $this->userRepository->getUserListByRole('teacher')
            ->map(function ($teacher) {
                    return [
                        'id' => $teacher->id,
                        'name' => $teacher->name,
                        'email' => $teacher->email,
                        'profile' => $teacher->profile ? [
                            'first_name' => $teacher->profile->first_name,
                            'last_name' => $teacher->profile->last_name,
                            'contact_number' => $teacher->profile->contact_number,
                            'avatar' => $teacher->profile->avatar,
                        ] : null,
                    ];
                });
    }

    public function updateProfile($userId, array $data)
    {
        return $this->userRepository->updateProfile($userId, $data);
    }
    
}