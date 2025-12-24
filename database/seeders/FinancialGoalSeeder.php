<?php

namespace Database\Seeders;

use App\Models\FinancialGoal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class FinancialGoalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->info('No users found. Please create users first.');
            return;
        }

        $goalTemplates = [
            [
                'title' => 'Emergency Fund',
                'description' => 'Build an emergency fund to cover 6 months of expenses',
                'target_amount' => 15000,
                'current_amount' => 4500,
                'months_ahead' => 12,
                'priority' => 'high',
                'status' => 'active',
                'notes' => 'Save $1000 per month to reach goal',
            ],
            [
                'title' => 'Buy a New Car',
                'description' => 'Save for a down payment on a new car',
                'target_amount' => 8000,
                'current_amount' => 2000,
                'months_ahead' => 8,
                'priority' => 'high',
                'status' => 'active',
                'notes' => 'Target: Honda Civic or Toyota Corolla',
            ],
            [
                'title' => 'Vacation to Europe',
                'description' => 'Plan a 2-week trip to Europe',
                'target_amount' => 5000,
                'current_amount' => 1200,
                'months_ahead' => 6,
                'priority' => 'medium',
                'status' => 'active',
                'notes' => 'Visit Paris, Rome, and Barcelona',
            ],
            [
                'title' => 'Home Down Payment',
                'description' => 'Save for down payment on first home',
                'target_amount' => 50000,
                'current_amount' => 12000,
                'months_ahead' => 36,
                'priority' => 'high',
                'status' => 'active',
                'notes' => 'Need 20% down payment',
            ],
            [
                'title' => 'New Laptop',
                'description' => 'Upgrade to a new MacBook Pro',
                'target_amount' => 2500,
                'current_amount' => 1800,
                'months_ahead' => 2,
                'priority' => 'medium',
                'status' => 'active',
                'notes' => 'For work and personal projects',
            ],
            [
                'title' => 'Wedding Fund',
                'description' => 'Save for wedding expenses',
                'target_amount' => 20000,
                'current_amount' => 5000,
                'months_ahead' => 18,
                'priority' => 'high',
                'status' => 'active',
                'notes' => 'Target date: Next year summer',
            ],
            [
                'title' => 'Investment Portfolio',
                'description' => 'Build investment portfolio for retirement',
                'target_amount' => 10000,
                'current_amount' => 3500,
                'months_ahead' => 24,
                'priority' => 'medium',
                'status' => 'active',
                'notes' => 'Diversified portfolio with stocks and bonds',
            ],
            [
                'title' => 'Education Fund',
                'description' => 'Save for professional certification courses',
                'target_amount' => 3000,
                'current_amount' => 1500,
                'months_ahead' => 5,
                'priority' => 'medium',
                'status' => 'active',
                'notes' => 'AWS or Google Cloud certifications',
            ],
        ];

        foreach ($users as $user) {
            // Create 3-5 random goals per user
            $goalCount = rand(3, 5);
            $selectedGoals = array_rand($goalTemplates, $goalCount);
            
            // Handle case when only one goal is selected
            if (!is_array($selectedGoals)) {
                $selectedGoals = [$selectedGoals];
            }

            foreach ($selectedGoals as $index) {
                $template = $goalTemplates[$index];
                
                FinancialGoal::create([
                    'user_id' => $user->id,
                    'title' => $template['title'],
                    'description' => $template['description'],
                    'target_amount' => $template['target_amount'],
                    'current_amount' => $template['current_amount'],
                    'target_date' => Carbon::now()->addMonths($template['months_ahead']),
                    'status' => $template['status'],
                    'priority' => $template['priority'],
                    'notes' => $template['notes'],
                ]);
            }

            $this->command->info("Created financial goals for user: {$user->name}");
        }
    }
}
