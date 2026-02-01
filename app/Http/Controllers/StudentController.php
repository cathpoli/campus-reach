<?php

namespace App\Http\Controllers;

use App\Services\AppointmentService;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    protected $studentService;
    protected $appointmentService;

    public function __construct(StudentService $studentService, AppointmentService $appointmentService)
    {
        $this->studentService = $studentService;
        $this->appointmentService = $appointmentService;
    }

    /**
     * Display a listing of students.
     */
    public function index()
    {
        $students = $this->studentService->getStudentsPaginated(10);

        return Inertia::render('pages/Users/Students', [
            'students' => $students
        ]);
    }

    /**
     * Show the form for creating a new student.
     */
    public function create()
    {
        return Inertia::render('pages/Users/AddStudent');
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extension' => 'nullable|string|max:10',
            'email' => 'required|email|unique:users,email',
            'student_number' => 'required|string|unique:profiles,student_number',
            'contact_number' => 'required|string|max:20',
            'gender' => 'required|in:Male,Female',
        ]);

        $this->studentService->createStudent($validated);

        return redirect()->route('users.students')->with('success', 'Student added successfully!');
    }

    /**
     * Display the specified student.
     */
    public function show($id)
    {
        // Not implemented - can redirect to edit or return a view
        return redirect()->route('users.students.edit', $id);
    }

    /**
     * Show the form for editing the specified student.
     */
    public function edit($id)
    {
        $student = $this->studentService->getStudentById($id);

        return Inertia::render('pages/Users/EditStudent', [
            'student' => $student
        ]);
    }

    /**
     * Update the specified student in storage.
     */
    public function update(Request $request, $id)
    {
        $student = $this->studentService->getStudentById($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extension' => 'nullable|string|max:10',
            'email' => 'required|email|unique:users,email,' . $id,
            'student_number' => 'required|string|unique:profiles,student_number,' . $student->profile->profile_id . ',profile_id',
            'contact_number' => 'required|string|max:20',
            'gender' => 'required|in:Male,Female',
        ]);

        $this->studentService->updateStudent($id, $validated);

        return redirect()->route('users.students')->with('success', 'Student updated successfully!');
    }

    /**
     * Remove the specified student from storage.
     */
    public function destroy($id)
    {
        $this->studentService->deleteStudent($id);

        return redirect()->route('users.students')->with('success', 'Student deleted successfully!');
    }

    public function studentCalendar()
    {
        $user = Auth::user();
        
        // Get student's approved appointments with teacher and schedule info
        $user = Auth::user();
        $data = $this->appointmentService->getApprovedEvents($user->id, $user->role);

        return Inertia::render('pages/Calendar/StudentCalendar', [
            'events' => $data,
        ]);
    }
}
