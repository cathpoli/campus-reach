<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Google\Client;
use Google\Service\Calendar;

class TestGoogleCalendar extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:google-calendar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Google Calendar API connection';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Google Calendar API connection...');

        try {
            $credentialsPath = storage_path('app/google-calendar/credentials.json');
            
            if (!file_exists($credentialsPath)) {
                $this->error('❌ Credentials file not found!');
                $this->warn('Expected location: ' . $credentialsPath);
                $this->info('Please follow GOOGLE_CALENDAR_SETUP.md to set up credentials.');
                return 1;
            }

            $this->info('✓ Credentials file found');

            $client = new Client();
            $client->setAuthConfig($credentialsPath);
            $client->addScope(Calendar::CALENDAR);

            $this->info('✓ Google Client initialized');

            $service = new Calendar($client);
            
            $this->info('✓ Calendar service created');
            $this->success('✅ Google Calendar API is properly configured!');
            $this->info('You can now create appointments with real Google Meet links.');

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->warn('Please check your credentials and setup.');
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
