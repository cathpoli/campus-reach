<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;

// Auth Routes (Guest only)
Route::middleware('guest')->group(function () {
    Route::get('/', [LoginController::class, 'create'])->name('login');
    Route::post('/', [LoginController::class, 'store']);
});

// Protected Routes (Authenticated users only)
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //-------- TEACHER ROUTES --------//
    //-------- Appointments --------//
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments');
    Route::post('/appointment/{id}/approve', [AppointmentController::class, 'approve'])->name('appointment.approve');
    Route::post('/appointment/{id}/cancel', [AppointmentController::class, 'cancel'])->name('appointment.cancel');
    Route::post('/appointment/{id}/complete', [AppointmentController::class, 'complete'])->name('appointment.complete');
    Route::post('/appointment/{id}/notes', [AppointmentController::class, 'addNotes'])->name('appointment.addNotes');

    //-------- Schedule --------//
    Route::get('/schedule/add', [ScheduleController::class, 'create'])->name('schedule.add');
    Route::post('/schedule/add', [ScheduleController::class, 'store']);
    Route::get('/schedule/list', [ScheduleController::class, 'index'])->name('schedule.list');
    Route::get('/schedule/edit/{id}', [ScheduleController::class, 'edit'])->name('schedule.edit');
    Route::put('/schedule/{id}', [ScheduleController::class, 'update'])->name('schedule.update');
    Route::delete('/schedule/{id}', [ScheduleController::class, 'destroy'])->name('schedule.destroy');

    //-------- STUDENT ROUTES --------//
    // Appointment Booking
    Route::get('/appointment/book/{teacherId}', [AppointmentController::class, 'create'])->name('appointment.book');
    Route::post('/appointment/store', [AppointmentController::class, 'store'])->name('appointment.store');
    Route::get('/student/appointments', [AppointmentController::class, 'studentAppointment'])->name('appointment.studentAppointment');

    // Calendar
    Route::get('/calendar', [StudentController::class, 'studentCalendar'])->name('studentCalendar');

    //-------- ADMIN ROUTES --------//
    // Students - Using Controller and Service
    Route::resource('users/students', StudentController::class)->names([
        'index' => 'users.students',
        'create' => 'users.students.create',
        'store' => 'users.students.store',
        'edit' => 'users.students.edit',
        'update' => 'users.students.update',
        'destroy' => 'users.students.destroy',
    ]);

    // Teachers - Using Controller and Service
    Route::resource('users/teachers', TeacherController::class)->names([
        'index' => 'users.teachers',
        'create' => 'users.teachers.create',
        'store' => 'users.teachers.store',
        'edit' => 'users.teachers.edit',
        'update' => 'users.teachers.update',
        'destroy' => 'users.teachers.destroy',
    ]);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.delete');

    // Logout
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Profile
    Route::get('/edit-profile', [UserController::class, 'edit'])->name('edit.profile');
    Route::put('/update-profile', [UserController::class, 'update'])->name('update.profile');

    // Other Pages
    Route::get('/blank', function () {
        return Inertia::render('pages/Blank');
    })->name('blank');

    Route::get('/404', function () {
        return Inertia::render('pages/OtherPage/NotFound');
    })->name('notfound');
});
