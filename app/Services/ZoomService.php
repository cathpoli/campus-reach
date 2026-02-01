<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ZoomService
{
    // Get the Access Token (Zoom tokens expire every hour, so we cache it)
    protected function getToken()
    {
        return Cache::remember('zoom_token', 3500, function () {
            $response = Http::asForm()
                ->post('https://zoom.us/oauth/token', [
                    'grant_type' => 'account_credentials',
                    'account_id' => env('ZOOM_ACCOUNT_ID'),
                    'client_id' => env('ZOOM_CLIENT_ID'),
                    'client_secret' => env('ZOOM_CLIENT_SECRET'),
                ]);

            if (!$response->successful()) {
                Log::error('Zoom OAuth Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to get Zoom access token: ' . $response->body());
            }

            $data = $response->json();
            
            if (!isset($data['access_token'])) {
                Log::error('Zoom OAuth Response Missing Token', ['response' => $data]);
                throw new \Exception('Access token not found in response');
            }

            return $data['access_token'];
        });
    }

    public function createMeeting($topic, $startTime)
    {
        $token = $this->getToken();
        
        $response = Http::withToken($token)
            ->post('https://api.zoom.us/v2/users/me/meetings', [
                'topic' => $topic,
                'type' => 2, // 2 = Scheduled Meeting
                'start_time' => $startTime, // Format: YYYY-MM-DDTHH:MM:SS
                'duration' => 40, // Zoom Free Limit is 40 mins
                'settings' => [
                    'host_video' => true,
                    'participant_video' => true,
                    'join_before_host' => false,
                    'waiting_room' => true,
                ],
            ]);

        if (!$response->successful()) {
            Log::error('Zoom Create Meeting Error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'topic' => $topic,
                'start_time' => $startTime
            ]);
            throw new \Exception('Failed to create Zoom meeting: ' . $response->body());
        }

        $data = $response->json();
        
        if (!isset($data['join_url']) || !isset($data['id'])) {
            Log::error('Zoom Meeting Response Invalid', ['response' => $data]);
            throw new \Exception('Invalid Zoom meeting response');
        }

        return $data;
    }
}
