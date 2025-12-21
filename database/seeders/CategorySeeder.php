<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users and create default categories for each
        $users = User::all();

        $defaultCategories = [
            // Expense categories
            ['name' => 'Food & Dining', 'type' => 'expense', 'color' => '#ef4444', 'description' => 'Groceries, restaurants, and food delivery'],
            ['name' => 'Transportation', 'type' => 'expense', 'color' => '#f97316', 'description' => 'Gas, public transport, and ride-sharing'],
            ['name' => 'Shopping', 'type' => 'expense', 'color' => '#f59e0b', 'description' => 'Clothing, electronics, and general shopping'],
            ['name' => 'Bills & Utilities', 'type' => 'expense', 'color' => '#eab308', 'description' => 'Electricity, water, internet, and phone bills'],
            ['name' => 'Entertainment', 'type' => 'expense', 'color' => '#84cc16', 'description' => 'Movies, concerts, streaming services'],
            ['name' => 'Healthcare', 'type' => 'expense', 'color' => '#22c55e', 'description' => 'Medical expenses, pharmacy, insurance'],
            ['name' => 'Housing', 'type' => 'expense', 'color' => '#10b981', 'description' => 'Rent, mortgage, home maintenance'],
            ['name' => 'Education', 'type' => 'expense', 'color' => '#14b8a6', 'description' => 'Courses, books, and educational materials'],
            ['name' => 'Personal Care', 'type' => 'expense', 'color' => '#06b6d4', 'description' => 'Haircut, spa, cosmetics'],
            ['name' => 'Loans & Credit Cards', 'type' => 'expense', 'color' => '#0ea5e9', 'description' => 'Loan payments and credit card bills'],
            ['name' => 'Insurance', 'type' => 'expense', 'color' => '#3b82f6', 'description' => 'Life, health, car insurance'],
            ['name' => 'Other Expenses', 'type' => 'expense', 'color' => '#6366f1', 'description' => 'Miscellaneous expenses'],
            
            // Income categories
            ['name' => 'Salary', 'type' => 'income', 'color' => '#8b5cf6', 'description' => 'Monthly salary'],
            ['name' => 'Freelance', 'type' => 'income', 'color' => '#a855f7', 'description' => 'Freelance projects and gigs'],
            ['name' => 'Business', 'type' => 'income', 'color' => '#c084fc', 'description' => 'Business income'],
            ['name' => 'Investments', 'type' => 'income', 'color' => '#d946ef', 'description' => 'Returns from investments'],
            ['name' => 'Other Income', 'type' => 'income', 'color' => '#ec4899', 'description' => 'Other sources of income'],
        ];

        foreach ($users as $user) {
            foreach ($defaultCategories as $category) {
                Category::create([
                    'user_id' => $user->id,
                    'name' => $category['name'],
                    'type' => $category['type'],
                    'color' => $category['color'],
                    'description' => $category['description'],
                ]);
            }
        }
    }
}
