<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        
        $notifications = Notification::where('receiver_id', $user->id)
            ->with(['sender.profile', 'event.schedule'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->notif_id,
                    'message' => $notification->message,
                    'is_read' => $notification->is_read,
                    'created_at' => $notification->created_at,
                    'sender' => [
                        'id' => $notification->sender->id,
                        'name' => $notification->sender->profile 
                            ? "{$notification->sender->profile->first_name} {$notification->sender->profile->last_name}"
                            : $notification->sender->name,
                        'avatar' => $notification->sender->profile->avatar ?? null,
                    ],
                    'event' => $notification->event ? [
                        'id' => $notification->event->event_id,
                        'title' => $notification->event->title,
                        'status' => $notification->event->status,
                        'zoom_link' => $notification->event->zoom_link,
                    ] : null,
                ];
            });

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $notifications->where('is_read', false)->count(),
        ]);
    }

    /**
     * Get unread notification count
     */
    public function unreadCount()
    {
        $user = Auth::user();
        
        $count = Notification::where('receiver_id', $user->id)
            ->where('is_read', 0)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        
        $notification = Notification::where('notif_id', $id)
            ->where('receiver_id', $user->id)
            ->firstOrFail();

        $notification->update(['is_read' => 1]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        
        Notification::where('receiver_id', $user->id)
            ->where('is_read', 0)
            ->update(['is_read' => 1]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Delete a notification
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $notification = Notification::where('notif_id', $id)
            ->where('receiver_id', $user->id)
            ->firstOrFail();

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }
}
