<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create the Super Admin test account
        User::create([
            'name' => 'Super Admin User',
            'email' => 'superadmin@chimes.com', // Fake email
            'password' => Hash::make('password123'), // Standard test password
            'role' => 'Super Admin',
        ]);

        // 2. Create the Admin test account
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@chimes.com',
            'password' => Hash::make('password123'),
            'role' => 'Admin',
        ]);

        // 3. Create the Viewer test account
        User::create([
            'name' => 'Viewer User',
            'email' => 'viewer@chimes.com',
            'password' => Hash::make('password123'),
            'role' => 'Viewer',
        ]);
    }
}