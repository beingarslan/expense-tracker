<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use App\Models\FinancialGoal;
use App\Models\RecurringPayment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $currentMonth = Carbon::now()->startOfMonth();
        $currentYear = Carbon::now()->startOfYear();

        // Get total income and expenses for current month
        $monthlyIncome = Expense::where('user_id', $userId)
            ->where('type', 'income')
            ->where('date', '>=', $currentMonth)
            ->sum('amount');

        $monthlyExpenses = Expense::where('user_id', $userId)
            ->where('type', 'expense')
            ->where('date', '>=', $currentMonth)
            ->sum('amount');

        // Get total income and expenses for current year
        $yearlyIncome = Expense::where('user_id', $userId)
            ->where('type', 'income')
            ->where('date', '>=', $currentYear)
            ->sum('amount');

        $yearlyExpenses = Expense::where('user_id', $userId)
            ->where('type', 'expense')
            ->where('date', '>=', $currentYear)
            ->sum('amount');

        // Get expenses by category for current month
        $expensesByCategory = Expense::select('category_id', DB::raw('SUM(amount) as total'))
            ->with('category')
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->where('date', '>=', $currentMonth)
            ->whereNotNull('category_id')
            ->groupBy('category_id')
            ->orderBy('total', 'desc')
            ->get();

        // Get recent expenses
        $recentExpenses = Expense::with('category')
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        // Get upcoming recurring payments (next 30 days)
        $upcomingPayments = RecurringPayment::with('category')
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->where('next_payment_date', '<=', Carbon::now()->addDays(30))
            ->orderBy('next_payment_date')
            ->get();

        // Get high priority expenses
        $highPriorityExpenses = Expense::with('category')
            ->where('user_id', $userId)
            ->where('priority', 'high')
            ->where('date', '>=', $currentMonth)
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Get active financial goals
        $activeGoals = FinancialGoal::where('user_id', $userId)
            ->where('status', 'active')
            ->orderBy('target_date', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($goal) {
                return [
                    'id' => $goal->id,
                    'title' => $goal->title,
                    'target_amount' => $goal->target_amount,
                    'current_amount' => $goal->current_amount,
                    'target_date' => $goal->target_date,
                    'progress_percentage' => $goal->progress_percentage,
                    'remaining_amount' => $goal->remaining_amount,
                ];
            });

        // Get monthly trend (last 6 months) - optimized with single query
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();
        
        // Use database-agnostic date formatting
        $driver = DB::connection()->getDriverName();
        $dateFormat = $driver === 'sqlite' 
            ? "strftime('%Y-%m', date) as month_key"
            : "DATE_FORMAT(date, '%Y-%m') as month_key";
        
        $monthlyData = Expense::selectRaw("
                {$dateFormat},
                type,
                SUM(amount) as total
            ")
            ->where('user_id', $userId)
            ->where('date', '>=', $sixMonthsAgo)
            ->groupBy('month_key', 'type')
            ->get()
            ->groupBy('month_key');

        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->startOfMonth();
            $monthKey = $month->format('Y-m');
            
            $monthData = $monthlyData->get($monthKey, collect());
            $income = $monthData->where('type', 'income')->sum('total');
            $expense = $monthData->where('type', 'expense')->sum('total');

            $monthlyTrend[] = [
                'month' => $month->format('M Y'),
                'income' => (float) $income,
                'expense' => (float) $expense,
                'balance' => (float) ($income - $expense),
            ];
        }

        // Get previous month comparison data
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();
        $previousMonthEnd = Carbon::now()->subMonth()->endOfMonth();
        
        $prevMonthIncome = Expense::where('user_id', $userId)
            ->where('type', 'income')
            ->whereBetween('date', [$previousMonth, $previousMonthEnd])
            ->sum('amount');
        
        $prevMonthExpenses = Expense::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('date', [$previousMonth, $previousMonthEnd])
            ->sum('amount');

        // Calculate percentage changes
        $incomeChange = $prevMonthIncome > 0 
            ? (($monthlyIncome - $prevMonthIncome) / $prevMonthIncome) * 100 
            : 0;
        $expenseChange = $prevMonthExpenses > 0 
            ? (($monthlyExpenses - $prevMonthExpenses) / $prevMonthExpenses) * 100 
            : 0;

        // Get weekly trend (last 4 weeks)
        $weeklyTrend = [];
        for ($i = 3; $i >= 0; $i--) {
            $weekStart = Carbon::now()->subWeeks($i)->startOfWeek();
            $weekEnd = Carbon::now()->subWeeks($i)->endOfWeek();
            
            $weekIncome = Expense::where('user_id', $userId)
                ->where('type', 'income')
                ->whereBetween('date', [$weekStart, $weekEnd])
                ->sum('amount');
            
            $weekExpense = Expense::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereBetween('date', [$weekStart, $weekEnd])
                ->sum('amount');

            $weeklyTrend[] = [
                'week' => $weekStart->format('M d'),
                'income' => (float) $weekIncome,
                'expense' => (float) $weekExpense,
                'balance' => (float) ($weekIncome - $weekExpense),
            ];
        }

        // Get timeline events (expenses + goals milestones)
        $timelineEvents = [];
        
        // Add recent expenses to timeline
        $recentTimelineExpenses = Expense::with('category')
            ->where('user_id', $userId)
            ->where('date', '>=', Carbon::now()->subDays(90))
            ->orderBy('date', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($expense) {
                return [
                    'id' => $expense->id,
                    'type' => 'transaction',
                    'subtype' => $expense->type,
                    'title' => $expense->title,
                    'amount' => $expense->amount,
                    'currency' => $expense->currency,
                    'date' => $expense->date,
                    'category' => $expense->category ? [
                        'name' => $expense->category->name,
                        'color' => $expense->category->color,
                    ] : null,
                ];
            });

        // Add goal milestones to timeline
        $goalMilestones = FinancialGoal::where('user_id', $userId)
            ->where('status', 'active')
            ->get()
            ->map(function ($goal) {
                return [
                    'id' => $goal->id,
                    'type' => 'goal',
                    'subtype' => 'milestone',
                    'title' => $goal->title,
                    'amount' => $goal->target_amount,
                    'currency' => 'USD',
                    'date' => $goal->target_date,
                    'progress' => $goal->progress_percentage,
                ];
            });

        $timelineEvents = $recentTimelineExpenses->concat($goalMilestones)
            ->sortByDesc('date')
            ->values()
            ->toArray();

        // Calculate savings rate
        $savingsRate = $monthlyIncome > 0 
            ? (($monthlyIncome - $monthlyExpenses) / $monthlyIncome) * 100 
            : 0;

        return Inertia::render('dashboard', [
            'summary' => [
                'monthly' => [
                    'income' => $monthlyIncome,
                    'expenses' => $monthlyExpenses,
                    'balance' => $monthlyIncome - $monthlyExpenses,
                    'incomeChange' => round($incomeChange, 2),
                    'expenseChange' => round($expenseChange, 2),
                    'savingsRate' => round($savingsRate, 2),
                ],
                'yearly' => [
                    'income' => $yearlyIncome,
                    'expenses' => $yearlyExpenses,
                    'balance' => $yearlyIncome - $yearlyExpenses,
                ],
            ],
            'expensesByCategory' => $expensesByCategory,
            'recentExpenses' => $recentExpenses,
            'upcomingPayments' => $upcomingPayments,
            'highPriorityExpenses' => $highPriorityExpenses,
            'monthlyTrend' => $monthlyTrend,
            'weeklyTrend' => $weeklyTrend,
            'timelineEvents' => $timelineEvents,
            'activeGoals' => $activeGoals,
        ]);
    }
}
