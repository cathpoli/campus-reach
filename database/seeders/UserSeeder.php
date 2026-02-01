<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $user = User::create([
            'email' => 'admin@campusreach.com',
            'password' => Hash::make('admin'),
            'role' => 'admin',
            'status' => 'Active',
        ]);

        // Create profile for admin user
        Profile::create([
            'user_id' => $user->id,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'honorifics' => 'Mr.',
            'middle_name' => 'System',
            'address' => 'Campus Reach HQ',
            'contact_number' => '+1234567890',
            'birthday' => '1990-01-01',
            'gender' => 'Male',
        ]);
    }
}
