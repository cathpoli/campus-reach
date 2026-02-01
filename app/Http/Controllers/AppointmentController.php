<?php

namespace App\Http\Controllers;

use App\Services\AppointmentService;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        $perPage = $request->input('per_page', 10);
        $status = $request->input('status', 'all');
        $search = $request->input('search', '');

        $appointments = $this->appointmentService->getAppointments(
            $user->id, 
            $perPage, 
            $status, 
            $search,
            $user->role
        );

        return Inertia::render('pages/AppointmentList/TeacherAppointmentList', [
            'appointments' => $appointments,
            'filters' => [
                'per_page' => $perPage,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function create($teacherId)
    {
        $user = Auth::user();
        if ($user->role !== 'student') abort(403, 'Unauthorized access');

        $teacher = User::with('profile')->findOrFail($teacherId);
        if ($teacher->role !== 'teacher') abort(404, 'Teacher not found');

        $schedules = $this->appointmentService->getAvailableSchedules($teacherId);

        return Inertia::render('pages/Appointment/BookAppointment', [
            'teacher' => $teacher,
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'student') abort(403, 'Unauthorized access');

        $validated = $request->validate([
            'schedule_id' => 'required|exists:schedules,schedule_id',
            'teacher_id' => 'required|exists:users,id',
            'title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $result = $this->appointmentService->bookAppointment($user, $validated);

        if (isset($result['error'])) {
            return back()->withErrors(['schedule_id' => $result['error']]);
        }

        return redirect()->route('dashboard')->with('success', 'Appointment booked successfully');
    }

    public function approve($id)
    {
        $user = Auth::user();
        if ($user->role !== 'teacher') abort(403, 'Unauthorized access');

        $result = $this->appointmentService->approveAppointment($id, $user->id);

        if (isset($result['error'])) {
            return back()->withErrors(['error' => $result['error']]);
        }

        return redirect()->back()->with('success', 'Appointment approved successfully');
    }

    public function cancel($id)
    {
        $user = Auth::user();
        if ($user->role !== 'teacher') abort(403, 'Unauthorized access');

        $result = $this->appointmentService->cancelAppointment($id, $user->id);

        if (isset($result['error'])) {
            return back()->withErrors(['error' => $result['error']]);
        }

        return redirect()->back()->with('success', 'Appointment cancelled successfully');
    }

    public function complete($id)
    {
        $user = Auth::user();
        if ($user->role !== 'teacher') abort(403, 'Unauthorized access');

        $result = $this->appointmentService->completeAppointment($id, $user->id);

        if (isset($result['error'])) {
            return back()->withErrors(['error' => $result['error']]);
        }

        return redirect()->back()->with('success', 'Appointment completed successfully');
    }

    public function addNotes(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role !== 'teacher') abort(403, 'Unauthorized access');

        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $result = $this->appointmentService->addNotes($id, $user->id, $validated['notes']);

        if (isset($result['error'])) {
            return back()->withErrors(['error' => $result['error']]);
        }

        return redirect()->back()->with('success', 'Notes added successfully');
    }

    public function studentAppointment(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'student') {
            abort(403, 'Unauthorized action.');
        }

        $perPage = $request->input('per_page', 10);
        $status = $request->input('status', 'all');
        $search = $request->input('search', '');

        $appointments = $this->appointmentService->getAppointments(
            $user->id, 
            $perPage, 
            $status, 
            $search,
            $user->role
        );

        return Inertia::render('pages/AppointmentList/StudentAppointmentList', [
            'appointments' => $appointments,
            'filters' => [
                'per_page' => $perPage,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }
}