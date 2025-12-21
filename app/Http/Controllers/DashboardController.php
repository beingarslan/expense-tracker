<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
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

        // Get monthly trend (last 6 months) - optimized with single query
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();
        
        $monthlyData = Expense::selectRaw("
                DATE_FORMAT(date, '%Y-%m') as month_key,
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
            ];
        }

        return Inertia::render('dashboard', [
            'summary' => [
                'monthly' => [
                    'income' => $monthlyIncome,
                    'expenses' => $monthlyExpenses,
                    'balance' => $monthlyIncome - $monthlyExpenses,
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
        ]);
    }
}
