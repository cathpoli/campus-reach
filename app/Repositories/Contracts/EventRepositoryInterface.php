<?php

namespace App\Repositories\Contracts;

interface EventRepositoryInterface
{
    public function getAppointments($id, $perPage = 10, $status = 'all', $search = '', $role);
    public function createAppointment(array $data);
    public function findByIdAndTeacher($eventId, $teacherId);
    public function updateStatus($eventId, $status);
    public function addNotes($eventId, $notes);
    public function getApprovedEvents($id, $role);
}