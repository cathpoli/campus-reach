<?php

namespace App\Repositories\Eloquent;

use App\Models\Schedule;
use App\Repositories\Contracts\ScheduleRepositoryInterface;
use Carbon\Carbon;

class ScheduleRepository implements ScheduleRepositoryInterface
{
    protected $model;

    public function __construct(Schedule $model)
    {
        $this->model = $model;
    }

    public function getTeacherSchedulesPaginated($teacherId, $perPage = 10, $status = 'all', $search = '')
    {
        $query = $this->model
            ->where('teacher_id', $teacherId);

        // Filter by status
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Search by date or day
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('date', 'like', "%{$search}%")
                ->orWhere('day', 'like', "%{$search}%");
            });
        }

        return $query
            ->orderBy('date', 'desc')
            ->orderBy('start_date_time', 'desc')
            ->paginate($perPage);
    }

    public function findById($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $schedule = $this->findById($id);
        $schedule->update($data);
        return $schedule->fresh();
    }

    public function delete($id)
    {
        $schedule = $this->findById($id);
        return $schedule->delete();
    }

    public function getAvailableSchedules($teacherId)
    {
        return $this->model->where('teacher_id', $teacherId)
            ->where('status', 'available')
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('start_date_time')
            ->get();
    }

    public function updateStatus($scheduleId, $status)
    {
        return $this->model->where('schedule_id', $scheduleId)->update(['status' => $status]);
    }

    public function hasSchasSchedule($teacherId)
    {
        return $this->model->where('teacher_id', $teacherId)->exists();
    }
}