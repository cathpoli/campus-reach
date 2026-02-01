<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit()
    {   
        $user = Auth::user();
        return Inertia::render('pages/Users/EditProfile', [
            'profile' => [
                'id' => $user->id,
                'role' => $user->role,
                'first_name' => $user->profile->first_name,
                'last_name' => $user->profile->last_name,
                'middle_name' => $user->profile->middle_name,
                'extension' => $user->profile->extension,
                'email' => $user->email,
                'student_number' => $user->profile->student_number,
                'employee_number' => $user->profile->employee_number,
                'contact_number' => $user->profile->contact_number,
                'gender' => $user->profile->gender,
            ]
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = Auth::user();

        $this->userService->updateProfile($user->id, $request->validated());

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
}
