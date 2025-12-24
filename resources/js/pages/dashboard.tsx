import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

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
    activeGoals,
}: DashboardData) {
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth.user.preferred_currency || 'USD';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Summary Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Monthly Balance
                        </h3>
                        <p
                            className={`mt-2 text-3xl font-bold ${
                                summary.monthly.balance >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                            {formatCurrency(summary.monthly.balance, userCurrency)}
                        </p>
                        <div className="mt-4 flex justify-between text-sm">
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Income
                                </p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(summary.monthly.income, userCurrency)}
                                </p>
                            </div>
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Expenses
                                </p>
                                <p className="font-semibold text-red-600 dark:text-red-400">
                                    {formatCurrency(summary.monthly.expenses, userCurrency)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Yearly Balance
                        </h3>
                        <p
                            className={`mt-2 text-3xl font-bold ${
                                summary.yearly.balance >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                            {formatCurrency(summary.yearly.balance, userCurrency)}
                        </p>
                        <div className="mt-4 flex justify-between text-sm">
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Income
                                </p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(summary.yearly.income, userCurrency)}
                                </p>
                            </div>
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Expenses
                                </p>
                                <p className="font-semibold text-red-600 dark:text-red-400">
                                    {formatCurrency(summary.yearly.expenses, userCurrency)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Upcoming Payments
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">
                            {upcomingPayments.length}
                        </p>
                        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                            Next 30 days
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Expenses by Category */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-semibold">
                            Expenses by Category
                        </h3>
                        <div className="space-y-3">
                            {expensesByCategory.length > 0 ? (
                                expensesByCategory.map((item) => (
                                    <div
                                        key={item.category_id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        item.category.color,
                                                }}
                                            />
                                            <span className="text-sm">
                                                {item.category.name}
                                            </span>
                                        </div>
                                        <span className="font-semibold">
                                            {formatCurrency(item.total)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    No expenses recorded this month
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Recent Expenses */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-semibold">
                            Recent Transactions
                        </h3>
                        <div className="space-y-3">
                            {recentExpenses.length > 0 ? (
                                recentExpenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between border-b border-neutral-200 pb-2 last:border-0 dark:border-neutral-700"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {expense.title}
                                            </p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                {expense.category?.name ||
                                                    'No category'}{' '}
                                                • {formatDate(expense.date)}
                                            </p>
                                        </div>
                                        <span
                                            className={`font-semibold ${
                                                expense.type === 'income'
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}
                                        >
                                            {expense.type === 'income'
                                                ? '+'
                                                : '-'}
                                            {formatCurrency(expense.amount, expense.currency)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    No transactions yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Recurring Payments */}
                    {upcomingPayments.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">
                                Upcoming Recurring Payments
                            </h3>
                            <div className="space-y-3">
                                {upcomingPayments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between border-b border-neutral-200 pb-2 last:border-0 dark:border-neutral-700"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {payment.title}
                                            </p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                {payment.frequency} •{' '}
                                                {formatDate(payment.next_payment_date)}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* High Priority Expenses */}
                    {highPriorityExpenses.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">
                                High Priority Expenses
                            </h3>
                            <div className="space-y-3">
                                {highPriorityExpenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between border-b border-neutral-200 pb-2 last:border-0 dark:border-neutral-700"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {expense.title}
                                            </p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                {expense.category?.name ||
                                                    'No category'}{' '}
                                                • {formatDate(expense.date)}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-red-600 dark:text-red-400">
                                            {formatCurrency(expense.amount, expense.currency)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Financial Goals Section */}
                {activeGoals && activeGoals.length > 0 && (
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                Active Financial Goals
                            </h3>
                            <a
                                href="/financial-goals"
                                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                            >
                                View All
                            </a>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {activeGoals.map((goal) => (
                                <div
                                    key={goal.id}
                                    className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                                >
                                    <h4 className="mb-2 font-semibold">
                                        {goal.title}
                                    </h4>
                                    <div className="mb-3">
                                        <div className="mb-1 flex justify-between text-sm">
                                            <span className="text-neutral-600 dark:text-neutral-400">
                                                Progress
                                            </span>
                                            <span className="font-medium">
                                                {goal.progress_percentage.toFixed(
                                                    1,
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                                            <div
                                                className="h-full rounded-full bg-blue-600"
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
                                                {formatCurrency(
                                                    goal.current_amount,
                                                    userCurrency,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-neutral-600 dark:text-neutral-400">
                                                Target
                                            </p>
                                            <p className="font-semibold">
                                                {formatCurrency(
                                                    goal.target_amount,
                                                    userCurrency,
                                                )}
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

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Monthly Trend Chart */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-semibold">
                            Income vs Expenses Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="month" 
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend />
                                <Bar 
                                    dataKey="income" 
                                    fill="#22c55e" 
                                    name="Income"
                                    radius={[8, 8, 0, 0]}
                                />
                                <Bar 
                                    dataKey="expense" 
                                    fill="#ef4444" 
                                    name="Expenses"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Expenses by Category Pie Chart */}
                    {expensesByCategory.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">
                                Expenses Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={expensesByCategory.map((item) => ({
                                            name: item.category.name,
                                            value: parseFloat(item.total.toString()),
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({
                                            cx,
                                            cy,
                                            midAngle,
                                            innerRadius,
                                            outerRadius,
                                            percent,
                                        }) => {
                                            const radius =
                                                innerRadius +
                                                (outerRadius - innerRadius) *
                                                    0.5;
                                            const x =
                                                cx +
                                                radius *
                                                    Math.cos(
                                                        (-midAngle * Math.PI) /
                                                            180,
                                                    );
                                            const y =
                                                cy +
                                                radius *
                                                    Math.sin(
                                                        (-midAngle * Math.PI) /
                                                            180,
                                                    );

                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="white"
                                                    textAnchor={
                                                        x > cx
                                                            ? 'start'
                                                            : 'end'
                                                    }
                                                    dominantBaseline="central"
                                                    fontSize={12}
                                                    fontWeight="bold"
                                                >
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {expensesByCategory.map((entry) => (
                                            <Cell
                                                key={`cell-${entry.category_id}`}
                                                fill={entry.category.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
