<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\TeacherService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    protected $teacherService;
    protected $userService;

    public function __construct(TeacherService $teacherService, UserService $userService)
    {
        $this->teacherService = $teacherService;
        $this->userService = $userService;
    }

    /**
     * Display a listing of students.
     */
    public function index()
    {
        $teachers = $this->teacherService->getTeachersPaginated(10);

        return Inertia::render('pages/Users/Teachers', [
            'teachers' => $teachers
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create()
    {
        return Inertia::render('pages/Users/AddTeacher');
    }

    /**
     * Store a newly created teacher in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extension' => 'nullable|string|max:10',
            'email' => 'required|email|unique:users,email',
            'employee_number' => 'required|string|unique:profiles,employee_number',
            'contact_number' => 'required|string|max:20',
            'gender' => 'required|in:Male,Female',
        ]);

        $this->teacherService->createTeacher($validated);

        return redirect()->route('users.teachers')->with('success', 'Teacher added successfully!');
    }

    /**
     * Display the specified teacher.
     */
    public function show($id)
    {
        // Not implemented - can redirect to edit or return a view
        return redirect()->route('users.teachers.edit', $id);
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit($id)
    {
        $teacher = $this->teacherService->getTeacherById($id);
        return Inertia::render('pages/Users/EditTeacher', [
            'teacher' => $teacher
        ]);
    }

    /**
     * Update the specified teacher in storage.
     */
    public function update(Request $request, $id)
    {
        $teacher = $this->teacherService->getTeacherById($id);
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extension' => 'nullable|string|max:10',
            'email' => 'required|email|unique:users,email,' . $id,
            'employee_number' => 'required|string|unique:profiles,employee_number,' . $teacher->profile->profile_id . ',profile_id',
            'contact_number' => 'required|string|max:20',
            'gender' => 'required|in:Male,Female',
        ]);

        $this->teacherService->updateTeacher($id, $validated);

        return redirect()->route('users.teachers')->with('success', 'Teacher updated successfully!');
    }

    /**
     * Remove the specified student from storage.
     */
    public function destroy($id)
    {
        $this->teacherService->deleteTeacher($id);

        return redirect()->route('users.teachers')->with('success', 'Teacher deleted successfully!');
    }
}
