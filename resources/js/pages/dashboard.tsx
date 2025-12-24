import {
    BalanceLineChart,
    CategoryPieChart,
    ChartCard,
    GoalProgressChart,
    TrendAreaChart,
} from '@/components/dashboard/charts';
import { Sparkline } from '@/components/dashboard/sparkline';
import { StatCard } from '@/components/dashboard/stat-card';
import { Timeline } from '@/components/dashboard/timeline';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronDown,
    DollarSign,
    PiggyBank,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardData {
    summary: {
        monthly: {
            income: number;
            expenses: number;
            balance: number;
            incomeChange: number;
            expenseChange: number;
            savingsRate: number;
        };
        yearly: {
            income: number;
            expenses: number;
            balance: number;
        };
    };
    expensesByCategory: Array<{
        category_id: number;
        total: number;
        category: {
            id: number;
            name: string;
            color: string;
        };
    }>;
    recentExpenses: Array<{
        id: number;
        title: string;
        amount: number;
        currency: string;
        type: string;
        date: string;
        priority: string;
        category?: {
            name: string;
            color: string;
        };
    }>;
    upcomingPayments: Array<{
        id: number;
        title: string;
        amount: number;
        currency: string;
        next_payment_date: string;
        frequency: string;
        category?: {
            name: string;
            color: string;
        };
    }>;
    highPriorityExpenses: Array<{
        id: number;
        title: string;
        amount: number;
        currency: string;
        date: string;
        category?: {
            name: string;
            color: string;
        };
    }>;
    monthlyTrend: Array<{
        month: string;
        income: number;
        expense: number;
        balance: number;
    }>;
    weeklyTrend: Array<{
        week: string;
        income: number;
        expense: number;
        balance: number;
    }>;
    timelineEvents: Array<{
        id: number;
        type: 'transaction' | 'goal';
        subtype?: string;
        title: string;
        amount: number;
        currency: string;
        date: string;
        category?: {
            name: string;
            color: string;
        };
        progress?: number;
    }>;
    activeGoals: Array<{
        id: number;
        title: string;
        target_amount: number;
        current_amount: number;
        target_date: string;
        progress_percentage: number;
        remaining_amount: number;
    }>;
}

export default function Dashboard({
    summary,
    expensesByCategory,
    recentExpenses,
    upcomingPayments,
    highPriorityExpenses,
    monthlyTrend,
    weeklyTrend,
    timelineEvents,
    activeGoals,
}: DashboardData) {
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth.user.preferred_currency || 'USD';
    const [showTimeline, setShowTimeline] = useState(false);
    const [showRecentTransactions, setShowRecentTransactions] = useState(true);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                            Welcome back, {auth.user.name}! Here's your financial overview.
                        </p>
                    </div>
                </div>

                {/* KPI Metrics - Top Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Monthly Income"
                        value={formatCurrency(summary.monthly.income, userCurrency)}
                        trend={{
                            value: summary.monthly.incomeChange,
                            isPositive: summary.monthly.incomeChange >= 0,
                        }}
                        icon={<ArrowUpRight className="h-6 w-6 text-green-600" />}
                        valueClassName="text-green-600 dark:text-green-400"
                    />
                    <StatCard
                        title="Monthly Expenses"
                        value={formatCurrency(summary.monthly.expenses, userCurrency)}
                        trend={{
                            value: summary.monthly.expenseChange,
                            isPositive: summary.monthly.expenseChange <= 0,
                        }}
                        icon={<ArrowDownRight className="h-6 w-6 text-red-600" />}
                        valueClassName="text-red-600 dark:text-red-400"
                    />
                    <StatCard
                        title="Net Balance"
                        value={formatCurrency(summary.monthly.balance, userCurrency)}
                        subtitle={`Savings Rate: ${summary.monthly.savingsRate.toFixed(1)}%`}
                        icon={<Wallet className="h-6 w-6 text-blue-600" />}
                        valueClassName={
                            summary.monthly.balance >= 0
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-red-600 dark:text-red-400'
                        }
                    />
                    <StatCard
                        title="Yearly Balance"
                        value={formatCurrency(summary.yearly.balance, userCurrency)}
                        subtitle={`Total: ${formatCurrency(summary.yearly.income, userCurrency)} income`}
                        icon={<PiggyBank className="h-6 w-6 text-purple-600" />}
                        valueClassName={
                            summary.yearly.balance >= 0
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-red-600 dark:text-red-400'
                        }
                    />
                </div>

                {/* Main Charts Section */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard
                        title="Income vs Expenses Trend"
                        subtitle="Last 6 months financial overview"
                    >
                        <TrendAreaChart data={monthlyTrend} userCurrency={userCurrency} />
                    </ChartCard>

                    <ChartCard
                        title="Balance Trend"
                        subtitle="Net balance over time"
                    >
                        <BalanceLineChart
                            data={monthlyTrend.map((item) => ({
                                month: item.month,
                                balance: item.balance,
                            }))}
                            userCurrency={userCurrency}
                        />
                    </ChartCard>
                </div>

                {/* Category Distribution and Goals */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {expensesByCategory.length > 0 && (
                        <ChartCard
                            title="Expenses by Category"
                            subtitle="Current month breakdown"
                        >
                            <CategoryPieChart
                                data={expensesByCategory}
                                userCurrency={userCurrency}
                            />
                        </ChartCard>
                    )}

                    {activeGoals && activeGoals.length > 0 && (
                        <ChartCard
                            title="Financial Goals Progress"
                            subtitle="Track your savings goals"
                        >
                            <GoalProgressChart goals={activeGoals} />
                        </ChartCard>
                    )}
                </div>

                {/* Financial Goals Detailed Section */}
                {activeGoals && activeGoals.length > 0 && (
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-sm dark:border-sidebar-border dark:from-neutral-900 dark:to-blue-950/20">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Active Financial Goals
                                </h3>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                    Track and achieve your financial milestones
                                </p>
                            </div>
                            <a
                                href="/financial-goals"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                Manage Goals
                            </a>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {activeGoals.map((goal) => (
                                <div
                                    key={goal.id}
                                    className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                                >
                                    <h4 className="mb-2 font-semibold">{goal.title}</h4>
                                    <div className="mb-3">
                                        <div className="mb-1 flex justify-between text-sm">
                                            <span className="text-neutral-600 dark:text-neutral-400">
                                                Progress
                                            </span>
                                            <span className="font-medium">
                                                {goal.progress_percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                style={{
                                                    width: `${Math.min(goal.progress_percentage, 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-neutral-600 dark:text-neutral-400">
                                                Current
                                            </p>
                                            <p className="font-semibold">
                                                {formatCurrency(goal.current_amount, userCurrency)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-neutral-600 dark:text-neutral-400">
                                                Target
                                            </p>
                                            <p className="font-semibold">
                                                {formatCurrency(goal.target_amount, userCurrency)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                                        Target: {formatDate(goal.target_date)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timeline Section */}
                {timelineEvents && timelineEvents.length > 0 && (
                    <Collapsible open={showTimeline} onOpenChange={setShowTimeline}>
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                            <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Financial Timeline
                                    </h3>
                                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                        View your recent transactions and upcoming goals
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`h-5 w-5 transition-transform ${showTimeline ? 'rotate-180' : ''}`}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <Separator />
                                <div className="p-6">
                                    <Timeline
                                        events={timelineEvents}
                                        userCurrency={userCurrency}
                                    />
                                </div>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>
                )}

                {/* Quick Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Upcoming Payments Card */}
                    {upcomingPayments.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-orange-950/20 dark:to-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">
                                Upcoming Payments
                            </h3>
                            <div className="space-y-3">
                                {upcomingPayments.slice(0, 3).map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-neutral-800"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {payment.title}
                                            </p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                {formatDate(payment.next_payment_date)}
                                            </p>
                                        </div>
                                        <span className="ml-2 flex-shrink-0 font-semibold text-orange-600 dark:text-orange-400">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* High Priority Expenses */}
                    {highPriorityExpenses.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-red-950/20 dark:to-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">
                                High Priority Expenses
                            </h3>
                            <div className="space-y-3">
                                {highPriorityExpenses.slice(0, 3).map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-neutral-800"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {expense.title}
                                            </p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                {expense.category?.name || 'No category'}
                                            </p>
                                        </div>
                                        <span className="ml-2 flex-shrink-0 font-semibold text-red-600 dark:text-red-400">
                                            {formatCurrency(expense.amount, expense.currency)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category Summary */}
                    {expensesByCategory.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-blue-950/20 dark:to-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">
                                Top Categories
                            </h3>
                            <div className="space-y-3">
                                {expensesByCategory.slice(0, 3).map((item) => (
                                    <div
                                        key={item.category_id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor: item.category.color,
                                                }}
                                            />
                                            <span className="text-sm">
                                                {item.category.name}
                                            </span>
                                        </div>
                                        <span className="font-semibold">
                                            {formatCurrency(item.total, userCurrency)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Transactions - Bottom Section */}
                <Collapsible
                    open={showRecentTransactions}
                    onOpenChange={setShowRecentTransactions}
                >
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Recent Transactions
                                </h3>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                    Your latest financial activity
                                </p>
                            </div>
                            <ChevronDown
                                className={`h-5 w-5 transition-transform ${showRecentTransactions ? 'rotate-180' : ''}`}
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <Separator />
                            <div className="p-6">
                                <div className="space-y-3">
                                    {recentExpenses.length > 0 ? (
                                        recentExpenses.map((expense) => (
                                            <div
                                                key={expense.id}
                                                className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                            expense.type === 'income'
                                                                ? 'bg-green-100 dark:bg-green-900/20'
                                                                : 'bg-red-100 dark:bg-red-900/20'
                                                        }`}
                                                    >
                                                        {expense.type === 'income' ? (
                                                            <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {expense.title}
                                                        </p>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                            {expense.category?.name ||
                                                                'No category'}{' '}
                                                            • {formatDate(expense.date)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-lg font-semibold ${
                                                        expense.type === 'income'
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                    }`}
                                                >
                                                    {expense.type === 'income' ? '+' : '-'}
                                                    {formatCurrency(
                                                        expense.amount,
                                                        expense.currency,
                                                    )}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-neutral-600 dark:text-neutral-400">
                                            No transactions yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>
            </div>
        </AppLayout>
    );
}
