<?php

namespace App\Services;

use App\Repositories\Contracts\ScheduleRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ScheduleService
{
    protected $scheduleRepository;

    public function __construct(ScheduleRepositoryInterface $scheduleRepository)
    {
        $this->scheduleRepository = $scheduleRepository;
    }

    /**
     * Get paginated schedules for a teacher with filters
     */
    public function getTeacherSchedules($teacherId, $perPage = 10, $status = 'all', $search = '')
    {
        $schedules = $this->scheduleRepository->getTeacherSchedulesPaginated(
            $teacherId, 
            $perPage, 
            $status, 
            $search
        );

        // Transform the paginated data
        $schedules->getCollection()->transform(function ($schedule) {
            return $this->formatSchedule($schedule);
        });

        return $schedules;
    }

    /**
     * Get a single schedule by ID
     */
    public function getScheduleById($scheduleId)
    {
        $schedule = $this->scheduleRepository->findById($scheduleId);
        return $this->formatSchedule($schedule);
    }

    /**
     * Create a new schedule
     */
    public function createSchedule(array $data, $teacherId)
    {
        // Wrap everything in a transaction
        return DB::transaction(function () use ($data, $teacherId) {
            // Add teacher_id to data
            $data['teacher_id'] = $teacherId;

            // Set default status if not provided
            $data['status'] = $data['status'] ?? 'available';

            // Set default time_schedule_id if not provided
            $data['time_schedule_id'] = $data['time_schedule_id'] ?? 0;

            // Parse the start and end date times
            $startDateTime = Carbon::parse($data['start_date_time']);
            $endDateTime = Carbon::parse($data['end_date_time']);

            // Extract TIME only from start_date_time
            $startTime = $startDateTime->format('H:i:s');
            
            // Extract TIME only from end_date_time
            $endTime = $endDateTime->format('H:i:s');

            // Calculate duration based on TIME difference only
            $timeStart = Carbon::createFromFormat('H:i:s', $startTime);
            $timeEnd = Carbon::createFromFormat('H:i:s', $endTime);
            $duration = $timeStart->diffInMinutes($timeEnd);

            if ($duration <= 0) {
                throw new \InvalidArgumentException('End time must be after start time.');
            }
            
            // Get the DATE RANGE (from start date to end date)
            $startDate = $startDateTime->copy()->startOfDay();
            $lastDate = $endDateTime->copy()->startOfDay();

            // Calculate how many schedules will be created
            $daysDiff = $startDate->diffInDays($lastDate) + 1;
            
            // Prevent creating too many schedules at once
            if ($daysDiff > 365) {
                throw new \Exception('Cannot create more than 365 schedules at once');
            }

            $createdSchedules = [];

            // Loop through each day in the range
            while ($startDate->lte($lastDate)) {
                // Create datetime for this specific day with the SAME TIME
                $scheduleStartDateTime = $startDate->copy()->setTimeFromTimeString($startTime);
                $scheduleEndDateTime = $startDate->copy()->setTimeFromTimeString($endTime);

                // Prepare data for this schedule
                $scheduleData = [
                    'teacher_id' => $teacherId,
                    'date' => $startDate->format('Y-m-d'),
                    'day' => $startDate->format('l'), // Monday, Tuesday, etc.
                    'start_date_time' => $scheduleStartDateTime->format('Y-m-d H:i:s'),
                    'end_date_time' => $scheduleEndDateTime->format('Y-m-d H:i:s'),
                    'duration' => $duration,
                    'status' => $data['status'],
                    'time_schedule_id' => $data['time_schedule_id'],
                ];

                // Create the schedule (if this fails, all will rollback)
                $createdSchedules[] = $this->scheduleRepository->create($scheduleData);

                // Move to next day
                $startDate->addDay();
            }

            // All schedules were created successfully. Transaction will auto-commit
            return $createdSchedules;
        });
    }

    /**
     * Update an existing schedule
     */
    public function updateSchedule($scheduleId, array $data, $teacherId)
    {
        $schedule = $this->scheduleRepository->findById($scheduleId);

        // Verify ownership
        if ($schedule->teacher_id != $teacherId) {
            throw new \Exception('Unauthorized to update this schedule');
        }

        // If schedule is booked, don't allow time changes
        if ($schedule->status === 'booked' && 
            (isset($data['start_date_time']) || isset($data['end_date_time']))) {
            throw new \Exception('Cannot modify time for a booked schedule');
        }

        // Combine date and start_time to form start_date_time
        if (isset($data['date']) && isset($data['start_time'])) {
            $data['start_date_time'] = $data['date'] . ' ' . $data['start_time'] . ':00';
        }

        // Combine date and end_time to form end_date_time (optional, if needed)
        if (isset($data['date']) && isset($data['end_time'])) {
            $data['end_date_time'] = $data['date'] . ' ' . $data['end_time'] . ':00';
        }

        return $this->scheduleRepository->update($scheduleId, $data);
    }

    /**
     * Delete a schedule
     */
    public function deleteSchedule($scheduleId, $teacherId)
    {
        $schedule = $this->scheduleRepository->findById($scheduleId);

        // Verify ownership
        if ($schedule->teacher_id != $teacherId) {
            throw new \Exception('Unauthorized to delete this schedule');
        }

        // Prevent deletion if booked
        if ($schedule->status === 'booked') {
            throw new \Exception('Cannot delete a booked schedule. Please cancel the appointment first.');
        }

        return $this->scheduleRepository->delete($scheduleId);
    }

    /**
     * Check if teacher has any schedules
     */
    public function hasSchedule($teacherId)
    {
        return $this->scheduleRepository->hasSchasSchedule($teacherId);
    }

    /**
     * Format schedule for display
     */
    private function formatSchedule($schedule)
    {
        $start = Carbon::parse($schedule->start_date_time);
        $end = Carbon::parse($schedule->end_date_time);

        return [
            'id' => $schedule->schedule_id,
            'teacher_id' => $schedule->teacher_id,
            'date' => $schedule->date->format('Y-m-d'),
            'day' => $schedule->day,
            'start_time' => $start->format('H:i'),
            'end_time' => $end->format('H:i'),
            'start_date_time' => $schedule->start_date_time,
            'end_date_time' => $schedule->end_date_time,
            'duration' => $schedule->duration,
            'status' => $schedule->status,
            'formatted_date' => $start->format('l, F j, Y'),
            'formatted_time' => $start->format('h:i A') . ' - ' . $end->format('h:i A'),
        ];
    }
}