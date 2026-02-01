<?php

namespace App\Repositories\Contracts;

interface NotificationRepositoryInterface
{
    public function createNotification(array $data);
}