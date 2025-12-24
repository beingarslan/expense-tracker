<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Container\Attributes\DB;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user with preferred currency
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
                'preferred_currency' => 'USD',
            ]
        );

        // Call all seeders in the correct order
        $this->call([
            CategorySeeder::class,
            ExpenseSeeder::class,
            FinancialGoalSeeder::class,
        ]);
    }
}
