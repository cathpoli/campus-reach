<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Schedule;
use App\Models\Event;
use App\Services\AppointmentService;
use App\Services\ScheduleService;
use App\Services\UserService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected $scheduleService;
    protected $appointmentService;
    protected $userService;

    public function __construct(
        ScheduleService $scheduleService, 
        AppointmentService $appointmentService,
        UserService $userService)
    {
        $this->scheduleService = $scheduleService;
        $this->appointmentService = $appointmentService;
        $this->userService = $userService;
    }

    /**
     * Display the dashboard based on user role.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Route to different dashboards based on user role
        if ($user->role === 'student') {
            return $this->studentDashboard();
        } elseif ($user->role === 'teacher') {
            return $this->teacherDashboard();
        } else {
            return $this->adminDashboard();
        }
    }

    /**
     * Student Dashboard
     */
    private function studentDashboard()
    {
        $user = Auth::user();

        if ($user->role !== 'student') {
            abort(403, 'Unauthorized access');
        }
        
        // Get all teachers with their profiles
        $teachers = $this->userService->getTeacherList();
        return Inertia::render('pages/Dashboard/Student/StudentDashboard', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Teacher Dashboard
     */
    private function teacherDashboard()
    {
        $user = Auth::user();

        if ($user->role !== 'teacher') {
            abort(403, 'Unauthorized access');
        }

        // Check if teacher has any schedules
        $hasSchedule = $this->scheduleService->hasSchedule($user->id);

        // Get teacher's approved appointments with student and schedule info
        $events = $this->appointmentService->getApprovedEvents($user->id, $user->role);

        return Inertia::render('pages/Dashboard/Teacher/TeacherDashboard', [
            'hasSchedule' => $hasSchedule,
            'events' => $events,
        ]);
    }

    /**
     * Admin Dashboard
     */
    private function adminDashboard()
    {
        $totalTeachers = User::where('role', 'teacher')->count();
        $totalStudents = User::where('role', 'student')->count();
        $approvedAppointments = Schedule::where('status', 'approved')->count();

        return Inertia::render('pages/Dashboard/Admin/AdminDashboard', [
            'totalTeachers' => $totalTeachers,
            'totalStudents' => $totalStudents,
            'approvedAppointments' => $approvedAppointments,
        ]);
    }
}
