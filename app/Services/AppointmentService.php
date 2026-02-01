<?php

namespace App\Services;

use App\Models\User;
use App\Events\NewNotification as NewNotificationEvent;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Repositories\Contracts\ScheduleRepositoryInterface;
use Carbon\Carbon;

class AppointmentService
{
    protected $eventRepo, $scheduleRepo, $notificationRepo, $zoomService;

    public function __construct(
        EventRepositoryInterface $eventRepo,
        ScheduleRepositoryInterface $scheduleRepo,
        NotificationRepositoryInterface $notificationRepo,
        ZoomService $zoomService
    ) {
        $this->eventRepo = $eventRepo;
        $this->scheduleRepo = $scheduleRepo;
        $this->notificationRepo = $notificationRepo;
        $this->zoomService = $zoomService;
    }

    public function getAppointments($id, $perPage = 10, $status = 'all', $search = '', $role)
    {
        $event = $this->eventRepo->getAppointments(
            $id, 
            $perPage, 
            $status, 
            $search,
            $role
        );

        // Transform the paginated data
        $event->getCollection()->transform(function ($schedule) {
            return $this->formatData($schedule);
        });

        return $event;
    }

    public function getAvailableSchedules($teacherId)
    {
        return $this->scheduleRepo->getAvailableSchedules($teacherId);
    }

    public function bookAppointment($student, $validated)
    {
        $schedule = $this->scheduleRepo->findById($validated['schedule_id']);
        if (!$schedule || $schedule->status !== 'available') {
            return ['error' => 'Schedule not available'];
        }

        $teacher = User::with('profile')->findOrFail($validated['teacher_id']);
        $student = User::with('profile')->findOrFail($student->id);

        $startDate = Carbon::parse($schedule->start_date_time);
        $endDate = Carbon::parse($schedule->end_date_time);

        $stringStartDate = $startDate->format('l jS \of F Y h:i A');
        $stringEndDate = $endDate->format('h:i A');

        $studentName = $student->profile 
            ? $student->profile->first_name . ' ' . $student->profile->last_name 
            : $student->name;
        $title = $validated['title'] ?? $studentName . ' booked an appointment on ' . $stringStartDate . ' to ' . $stringEndDate;

        $zoomResult = $this->zoomService->createMeeting($title, $startDate->format('Y-m-d\TH:i:s'));
        $meetingLink = isset($zoomResult['join_url']) ? $zoomResult['join_url'] : null;
        $meetingId = isset($zoomResult['id']) ? (string) $zoomResult['id'] : null;

        $event = $this->eventRepo->createAppointment([
            'teacher_id' => $validated['teacher_id'],
            'student_id' => $student->id,
            'schedule_id' => $validated['schedule_id'],
            'title' => $title,
            'notes' => $validated['notes'],
            'status' => 'Pending',
            'zoom_meeting_id' => $meetingId,
            'zoom_link' => $meetingLink,
        ]);

        $notification = $this->notificationRepo->createNotification([
            'event_id' => $event->event_id,
            'sender_id' => $student->id,
            'receiver_id' => $validated['teacher_id'],
            'message' => $studentName . ' has requested an appointment on ' . $stringStartDate,
            'is_read' => 0,
        ]);

        $notification->load(['sender.profile', 'receiver']);
        broadcast(new NewNotificationEvent($notification))->toOthers();

        $this->scheduleRepo->updateStatus($schedule->schedule_id, 'booked');

        return ['success' => true];
    }

    public function approveAppointment($eventId, $teacherId)
    {
        $event = $this->eventRepo->findByIdAndTeacher($eventId, $teacherId);
        if (!$event) return ['error' => 'Event not found'];

        $this->eventRepo->updateStatus($eventId, 'Approved');

        $notification = $this->notificationRepo->createNotification([
            'event_id' => $event->event_id,
            'sender_id' => $teacherId,
            'receiver_id' => $event->student_id,
            'message' => 'Your appointment request has been approved',
            'is_read' => 0,
        ]);
        $notification->load(['sender.profile', 'receiver']);
        broadcast(new NewNotificationEvent($notification))->toOthers();

        return ['success' => true];
    }

    public function cancelAppointment($eventId, $teacherId)
    {
        $event = $this->eventRepo->findByIdAndTeacher($eventId, $teacherId);
        if (!$event) return ['error' => 'Event not found'];

        $this->eventRepo->updateStatus($eventId, 'Cancelled');
        if ($event->schedule) {
            $this->scheduleRepo->updateStatus($event->schedule->schedule_id, 'available');
        }

        $notification = $this->notificationRepo->createNotification([
            'event_id' => $event->event_id,
            'sender_id' => $teacherId,
            'receiver_id' => $event->student_id,
            'message' => 'Your appointment request has been declined',
            'is_read' => 0,
        ]);
        $notification->load(['sender.profile', 'receiver']);
        broadcast(new NewNotificationEvent($notification))->toOthers();

        return ['success' => true];
    }

    public function completeAppointment($eventId, $teacherId)
    {
        $event = $this->eventRepo->findByIdAndTeacher($eventId, $teacherId);
        if (!$event) return ['error' => 'Event not found'];

        $this->eventRepo->updateStatus($eventId, 'Completed');

        $notification = $this->notificationRepo->createNotification([
            'event_id' => $event->event_id,
            'sender_id' => $teacherId,
            'receiver_id' => $event->student_id,
            'message' => 'Your appointment has been completed. Check if there are any notes or follow-ups needed.',
            'is_read' => 0,
        ]);
        $notification->load(['sender.profile', 'receiver']);
        broadcast(new NewNotificationEvent($notification))->toOthers();

        return ['success' => true];
    }

    public function addNotes($eventId, $teacherId, $notes)
    {
        $event = $this->eventRepo->findByIdAndTeacher($eventId, $teacherId);
        if (!$event) return ['error' => 'Event not found'];

        $this->eventRepo->addNotes($eventId, $notes);

        return ['success' => true];
    }

    public function getApprovedEvents($id, $role)
    {
        $events = $this->eventRepo->getApprovedEvents($id, $role)
            ->map(function ($event) {
                return [
                    'id' => $event->event_id,
                    'title' => $event->title,
                    'start' => $event->schedule->date . 'T' . $event->schedule->start_date_time,
                    'end' => $event->schedule->date . 'T' . $event->schedule->end_date_time,
                    'start_time' => Carbon::parse($event->schedule->start_date_time)->format('M j, Y ga'),
                    'end_time' => Carbon::parse($event->schedule->end_date_time)->format('M j, Y ga'),
                    'student_name' => $event->student && $event->student->profile 
                        ? "{$event->student->profile->first_name} {$event->student->profile->last_name}"
                        : ($event->student->name ?? 'Unknown'),
                    'teacher_name' => $event->teacher && $event->teacher->profile 
                        ? "{$event->teacher->profile->first_name} {$event->teacher->profile->last_name}"
                        : ($event->teacher->name ?? 'Unknown'),
                    'zoom_link' => $event->zoom_link,
                ];
            });

        return $events;
    }

    /**
     * Format appointment for display
     */
    private function formatData($event)
    {
        return [
            'id' => $event->event_id,
            'title' => $event->title,
            'description' => $event->notes,
            'date' => $event->schedule ? $event->schedule->date : null,
            'time' => $event->schedule ? date('H:i', strtotime($event->schedule->start_date_time)) : null,
            'duration' => $event->schedule ? $event->schedule->duration : null,
            'status' => $event->status ?? 'pending',
            'student_name' => $event->student && $event->student->profile 
                ? "{$event->student->profile->first_name} {$event->student->profile->last_name}"
                : ($event->student->name ?? 'Unknown'),
            'teacher_name' => $event->teacher && $event->teacher->profile 
                ? "{$event->teacher->profile->first_name} {$event->teacher->profile->last_name}"
                : ($event->teacher->name ?? 'Unknown'),
            'student_email' => $event->student->email ?? '',
            'teacher_email' => $event->teacher->email ?? '',
            'zoom_link' => $event->zoom_link,
            'notes' => $event->notes,
        ];
    }
}