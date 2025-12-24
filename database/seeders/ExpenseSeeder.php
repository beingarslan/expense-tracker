<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Expense;
use App\Models\RecurringPayment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
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

        foreach ($users as $user) {
            // Get user's categories
            $expenseCategories = Category::where('user_id', $user->id)
                ->where('type', 'expense')
                ->get();
            
            $incomeCategories = Category::where('user_id', $user->id)
                ->where('type', 'income')
                ->get();

            if ($expenseCategories->isEmpty() || $incomeCategories->isEmpty()) {
                $this->command->info("No categories found for user {$user->name}. Skipping...");
                continue;
            }

            // Create income transactions (monthly salary and freelance)
            $salaryCategory = $incomeCategories->where('name', 'Salary')->first();
            $freelanceCategory = $incomeCategories->where('name', 'Freelance')->first();

            // Monthly salary for the last 6 months
            for ($i = 0; $i < 6; $i++) {
                $date = Carbon::now()->subMonths($i)->startOfMonth()->addDays(rand(0, 5));
                
                if ($salaryCategory) {
                    Expense::create([
                        'user_id' => $user->id,
                        'category_id' => $salaryCategory->id,
                        'title' => 'Monthly Salary',
                        'amount' => rand(5000, 8000),
                        'currency' => $user->preferred_currency ?? 'USD',
                        'type' => 'income',
                        'date' => $date,
                        'notes' => 'Regular monthly salary payment',
                        'priority' => 'medium',
                        'is_recurring' => false,
                    ]);
                }

                // Random freelance income
                if ($freelanceCategory && rand(0, 1)) {
                    Expense::create([
                        'user_id' => $user->id,
                        'category_id' => $freelanceCategory->id,
                        'title' => 'Freelance Project - ' . ['Website Design', 'App Development', 'Consulting', 'Content Writing'][rand(0, 3)],
                        'amount' => rand(1000, 5000),
                        'currency' => $user->preferred_currency ?? 'USD',
                        'type' => 'income',
                        'date' => $date->copy()->addDays(rand(5, 20)),
                        'notes' => 'Freelance project payment',
                        'priority' => 'high',
                        'is_recurring' => false,
                    ]);
                }
            }

            // Create various expense transactions
            $expenseData = [
                'Food & Dining' => [
                    ['Grocery Shopping', 200, 400, 'low'],
                    ['Restaurant Dinner', 50, 150, 'low'],
                    ['Coffee Shop', 15, 40, 'low'],
                ],
                'Transportation' => [
                    ['Gas', 60, 100, 'medium'],
                    ['Uber Ride', 20, 50, 'low'],
                    ['Car Maintenance', 100, 500, 'high'],
                ],
                'Bills & Utilities' => [
                    ['Electricity Bill', 80, 150, 'high'],
                    ['Internet Bill', 50, 100, 'high'],
                    ['Phone Bill', 30, 80, 'medium'],
                ],
                'Shopping' => [
                    ['Clothing', 50, 300, 'low'],
                    ['Electronics', 200, 1000, 'medium'],
                    ['Home Supplies', 50, 200, 'low'],
                ],
                'Entertainment' => [
                    ['Movie Tickets', 20, 50, 'low'],
                    ['Concert', 50, 200, 'low'],
                    ['Streaming Services', 15, 50, 'low'],
                ],
                'Healthcare' => [
                    ['Doctor Visit', 50, 200, 'high'],
                    ['Pharmacy', 20, 100, 'medium'],
                    ['Health Insurance', 200, 500, 'high'],
                ],
                'Loans & Credit Cards' => [
                    ['Credit Card Payment', 500, 2000, 'high'],
                    ['Loan EMI', 800, 1500, 'high'],
                ],
            ];

            // Create random expenses for the last 3 months
            for ($i = 0; $i < 3; $i++) {
                $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
                $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();

                foreach ($expenseData as $categoryName => $transactions) {
                    $category = $expenseCategories->where('name', $categoryName)->first();
                    
                    if (!$category) continue;

                    // Create 1-3 transactions per category per month
                    $transactionCount = rand(1, 3);
                    for ($j = 0; $j < $transactionCount; $j++) {
                        $transaction = $transactions[array_rand($transactions)];
                        
                        Expense::create([
                            'user_id' => $user->id,
                            'category_id' => $category->id,
                            'title' => $transaction[0],
                            'amount' => rand($transaction[1], $transaction[2]),
                            'currency' => $user->preferred_currency ?? 'USD',
                            'type' => 'expense',
                            'date' => Carbon::create($monthStart)->addDays(rand(0, $monthEnd->day - 1)),
                            'notes' => 'Sample expense for ' . $transaction[0],
                            'priority' => $transaction[3],
                            'is_recurring' => false,
                        ]);
                    }
                }
            }

            // Create recurring payments (EMIs and subscriptions)
            $recurringData = [
                [
                    'title' => 'Home Loan EMI',
                    'amount' => rand(1200, 1800),
                    'frequency' => 'monthly',
                    'category' => 'Loans & Credit Cards',
                    'notes' => 'Monthly home loan EMI payment',
                ],
                [
                    'title' => 'Car Loan EMI',
                    'amount' => rand(400, 800),
                    'frequency' => 'monthly',
                    'category' => 'Loans & Credit Cards',
                    'notes' => 'Monthly car loan EMI payment',
                ],
                [
                    'title' => 'Netflix Subscription',
                    'amount' => 15.99,
                    'frequency' => 'monthly',
                    'category' => 'Entertainment',
                    'notes' => 'Monthly Netflix subscription',
                ],
                [
                    'title' => 'Spotify Premium',
                    'amount' => 9.99,
                    'frequency' => 'monthly',
                    'category' => 'Entertainment',
                    'notes' => 'Monthly Spotify Premium subscription',
                ],
                [
                    'title' => 'Gym Membership',
                    'amount' => rand(30, 80),
                    'frequency' => 'monthly',
                    'category' => 'Healthcare',
                    'notes' => 'Monthly gym membership fee',
                ],
                [
                    'title' => 'Insurance Premium',
                    'amount' => rand(100, 300),
                    'frequency' => 'monthly',
                    'category' => 'Insurance',
                    'notes' => 'Monthly insurance premium payment',
                ],
            ];

            foreach ($recurringData as $payment) {
                $category = Category::where('user_id', $user->id)
                    ->where('name', $payment['category'])
                    ->first();

                if (!$category) continue;

                $startDate = Carbon::now()->subMonths(6);
                $nextPaymentDate = Carbon::now()->addDays(rand(1, 30));

                RecurringPayment::create([
                    'user_id' => $user->id,
                    'category_id' => $category->id,
                    'title' => $payment['title'],
                    'amount' => $payment['amount'],
                    'currency' => $user->preferred_currency ?? 'USD',
                    'frequency' => $payment['frequency'],
                    'start_date' => $startDate,
                    'next_payment_date' => $nextPaymentDate,
                    'end_date' => null,
                    'notes' => $payment['notes'],
                    'status' => 'active',
                ]);
            }

            $this->command->info("Created test expenses and recurring payments for user: {$user->name}");
        }
    }
}
