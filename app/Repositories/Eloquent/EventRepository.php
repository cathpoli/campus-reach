<?php

namespace App\Repositories\Eloquent;

use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;

class EventRepository implements EventRepositoryInterface
{
    protected $model;

    public function __construct(Event $model)
    {
        $this->model = $model;
    }

    public function getAppointments($id, $perPage = 10, $status = 'all', $search = '', $role)
    {
        $query = $this->model->newQuery();

        // Filter by status
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Search by date or day
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        return $query
            ->where($role === 'teacher' ? 'teacher_id' : 'student_id', $id)
            ->with(['student.profile', 'schedule'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function createAppointment(array $data)
    {
        return $this->model->create($data);
    }

    public function findByIdAndTeacher($eventId, $teacherId)
    {
        return $this->model->where('event_id', $eventId)
            ->where('teacher_id', $teacherId)
            ->with(['student.profile', 'schedule'])
            ->first();
    }

    public function updateStatus($eventId, $status)
    {
        return $this->model->where('event_id', $eventId)->update(['status' => $status]);
    }

    public function addNotes($eventId, $notes)
    {
        return $this->model->where('event_id', $eventId)->update(['notes' => $notes]);
    }

    public function getApprovedEvents($id, $role)
    {
        $with = $role === 'teacher'
            ? ['student.profile', 'schedule']
            : ['teacher.profile', 'schedule'];

        return $this->model->where($role === 'teacher' ? 'teacher_id' : 'student_id', $id)
            ->where('status', 'Approved')
            ->with($with)
            ->get();
    }
}