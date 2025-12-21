import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
}

export default function Dashboard({
    summary,
    expensesByCategory,
    recentExpenses,
    upcomingPayments,
    highPriorityExpenses,
    monthlyTrend,
}: DashboardData) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

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
                            {formatCurrency(summary.monthly.balance)}
                        </p>
                        <div className="mt-4 flex justify-between text-sm">
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Income
                                </p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(summary.monthly.income)}
                                </p>
                            </div>
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Expenses
                                </p>
                                <p className="font-semibold text-red-600 dark:text-red-400">
                                    {formatCurrency(summary.monthly.expenses)}
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
                            {formatCurrency(summary.yearly.balance)}
                        </p>
                        <div className="mt-4 flex justify-between text-sm">
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Income
                                </p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(summary.yearly.income)}
                                </p>
                            </div>
                            <div>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Expenses
                                </p>
                                <p className="font-semibold text-red-600 dark:text-red-400">
                                    {formatCurrency(summary.yearly.expenses)}
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
                                                • {expense.date}
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
                                            {formatCurrency(expense.amount)}
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
                                                {payment.next_payment_date}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                                            {formatCurrency(payment.amount)}
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
                                                • {expense.date}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-red-600 dark:text-red-400">
                                            {formatCurrency(expense.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
