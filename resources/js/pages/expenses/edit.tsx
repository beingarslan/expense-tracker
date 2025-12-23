import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Expenses',
        href: '/expenses',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface Category {
    id: number;
    name: string;
    color: string;
    type: string;
}

interface Expense {
    id: number;
    title: string;
    amount: number;
    currency: string;
    type: string;
    category_id: number | null;
    date: string;
    notes: string;
    priority: string;
    is_recurring: boolean;
}

interface EditExpenseProps {
    expense: Expense;
    categories: Category[];
}

export default function EditExpense({ expense, categories }: EditExpenseProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: expense.title,
        amount: expense.amount.toString(),
        currency: expense.currency || 'USD',
        type: expense.type,
        category_id: expense.category_id?.toString() || '',
        date: expense.date,
        notes: expense.notes || '',
        priority: expense.priority,
        is_recurring: expense.is_recurring,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/expenses/${expense.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Expense" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit Expense</h1>

                <div className="max-w-2xl rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium"
                            >
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="amount"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Amount *
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                    required
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="currency"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Currency *
                                </label>
                                <select
                                    id="currency"
                                    value={data.currency}
                                    onChange={(e) =>
                                        setData('currency', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                    <option value="INR">INR (₹)</option>
                                    <option value="CAD">CAD (C$)</option>
                                    <option value="AUD">AUD (A$)</option>
                                    <option value="CNY">CNY (¥)</option>
                                    <option value="CHF">CHF</option>
                                    <option value="SEK">SEK (kr)</option>
                                    <option value="PKR">PKR (₨)</option>
                                </select>
                                {errors.currency && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.currency}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="date"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData('date', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                    required
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Type *
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="category_id"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Category
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <option value="">Select Category</option>
                                    {categories
                                        .filter(
                                            (cat) => cat.type === data.type,
                                        )
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="priority"
                                className="mb-2 block text-sm font-medium"
                            >
                                Priority *
                            </label>
                            <select
                                id="priority"
                                value={data.priority}
                                onChange={(e) =>
                                    setData('priority', e.target.value)
                                }
                                className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            {errors.priority && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.priority}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="mb-2 block text-sm font-medium"
                            >
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                rows={4}
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Update Expense'}
                            </button>
                            <Link
                                href="/expenses"
                                className="rounded-lg border border-neutral-300 px-6 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
