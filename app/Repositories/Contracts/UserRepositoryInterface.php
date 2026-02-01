<?php

namespace App\Repositories\Contracts;

interface UserRepositoryInterface
{
    public function findById($id);
    public function getUserListByRole($role);
    public function updateProfile($userId, array $data);
}