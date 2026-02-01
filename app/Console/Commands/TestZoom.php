<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ZoomService;

class TestZoom extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:zoom';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Zoom API connection and create a test meeting';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Zoom API connection...');

        // Check environment variables
        if (!env('ZOOM_ACCOUNT_ID') || !env('ZOOM_CLIENT_ID') || !env('ZOOM_CLIENT_SECRET')) {
            $this->error('❌ Zoom credentials not found in .env file!');
            $this->warn('Required variables: ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET');
            return 1;
        }

        $this->info('✓ Zoom credentials found in .env');

        try {
            $zoomService = new ZoomService();
            
            // Create a test meeting
            $testTopic = 'CampusReach Test Meeting';
            $testStartTime = now()->addHours(1)->format('Y-m-d\TH:i:s');
            
            $this->info('Creating test meeting...');
            $meeting = $zoomService->createMeeting($testTopic, $testStartTime);

            $this->success('✅ Zoom API is working!');
            $this->line('');
            $this->line('<fg=cyan>Test Meeting Details:</>');
            $this->line('Meeting ID: ' . $meeting['id']);
            $this->line('Topic: ' . $meeting['topic']);
            $this->line('Join URL: ' . $meeting['join_url']);
            $this->line('Start Time: ' . $meeting['start_time']);
            $this->line('Duration: ' . $meeting['duration'] . ' minutes');
            $this->line('');
            $this->info('You can now create appointments with real Zoom links!');

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->warn('Please check your Zoom credentials and setup.');
            $this->info('See ZOOM_SETUP.md for detailed instructions.');
            return 1;
        }
    }

    /**
     * Display success message in green
     */
    protected function success($message)
    {
        $this->line("<fg=green>$message</>");
    }
}
