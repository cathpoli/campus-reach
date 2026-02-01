<?php

namespace App\Repositories\Contracts;

interface ScheduleRepositoryInterface
{
    public function getTeacherSchedulesPaginated($teacherId, $perPage = 10, $status = 'all', $search = '');
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getAvailableSchedules($teacherId);
    public function updateStatus($scheduleId, $status);
    public function hasSchasSchedule($teacherId);
}