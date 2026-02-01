<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Services\ScheduleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Display schedule list for teachers
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        // Get filters from request
        $perPage = $request->input('per_page', 10);
        $status = $request->input('status', 'all');
        $search = $request->input('search', '');

        $schedules = $this->scheduleService->getTeacherSchedules(
            $user->id, 
            $perPage, 
            $status, 
            $search
        );

        return Inertia::render('pages/Schedule/TeacherScheduleList', [
            'schedules' => $schedules,
            'filters' => [
                'per_page' => $perPage,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new schedule
     */
    public function create()
    {
        $user = Auth::user();

        if ($user->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('pages/Schedule/AddSchedule');
    }

    /**
     * Store a new schedule
     */
    public function store(StoreScheduleRequest $request)
    {
        try {
            $schedule = $this->scheduleService->createSchedule(
                $request->validated(), // Only validated data
                Auth::id()
            );

            return redirect()->route('schedule.list')->with('success', 'Schedule created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Show the form for editing a schedule
     */
    public function edit($id)
    {
        $user = Auth::user();

        if ($user->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        try {
            $schedule = $this->scheduleService->getScheduleById($id);

            // Check if the schedule belongs to the authenticated teacher
            if ($schedule['teacher_id'] !== $user->id) {
                abort(403, 'Unauthorized action.');
            }

            // Check if the schedule is booked
            if ($schedule['status'] === 'booked') {
                return redirect()->route('schedule.list')
                    ->withErrors(['error' => 'Cannot edit a booked schedule. Please cancel the appointment first.']);
            }

            return Inertia::render('pages/Schedule/EditSchedule', [
                'schedule' => $schedule
            ]);
        } catch (\Exception $e) {
            return redirect()->route('schedule.list')
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified schedule
     */
    public function update(UpdateScheduleRequest $request, $id)
    {
        try {
            $user = Auth::user();

            $schedule = $this->scheduleService->updateSchedule(
                $id,
                $request->validated(),
                $user->id
            );

            return redirect()->route('schedule.list')
                ->with('success', 'Schedule updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Delete schedule
     */
    public function destroy($id)
    {
        try {
            $this->scheduleService->deleteSchedule($id, Auth::id());
            
            return redirect()->back()->with('success', 'Schedule deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
