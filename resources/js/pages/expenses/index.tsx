import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Search, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Expenses',
        href: '/expenses',
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
    type: string;
    date: string;
    priority: string;
    notes?: string;
    category?: Category;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: Expense[];
}

interface ExpensesProps {
    expenses: PaginationData;
    categories: Category[];
    filters: {
        category_id?: string;
        type?: string;
        priority?: string;
        start_date?: string;
        end_date?: string;
        search?: string;
    };
}

export default function ExpensesIndex({
    expenses,
    categories,
    filters,
}: ExpensesProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category_id || '',
    );
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority || '');

    const handleFilter = () => {
        router.get(
            '/expenses',
            {
                search,
                category_id: categoryFilter,
                type: typeFilter,
                priority: priorityFilter,
                page: 1, // Reset to page 1 when applying filters
            },
            { preserveState: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(`/expenses/${id}`);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expenses" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <Link
                        href="/expenses/create"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <PlusCircle size={20} />
                        Add Expense
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Search
                            </label>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search expenses..."
                                    className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-3 dark:border-neutral-700 dark:bg-neutral-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                                className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Type
                            </label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">All Types</option>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Priority
                            </label>
                            <select
                                value={priorityFilter}
                                onChange={(e) =>
                                    setPriorityFilter(e.target.value)
                                }
                                className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleFilter}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-neutral-200 dark:border-neutral-700">
                                <tr>
                                    <th className="p-4 text-left text-sm font-medium">
                                        Title
                                    </th>
                                    <th className="p-4 text-left text-sm font-medium">
                                        Category
                                    </th>
                                    <th className="p-4 text-left text-sm font-medium">
                                        Amount
                                    </th>
                                    <th className="p-4 text-left text-sm font-medium">
                                        Type
                                    </th>
                                    <th className="p-4 text-left text-sm font-medium">
                                        Priority
                                    </th>
                                    <th className="p-4 text-left text-sm font-medium">
                                        Date
                                    </th>
                                    <th className="p-4 text-right text-sm font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.data.length > 0 ? (
                                    expenses.data.map((expense) => (
                                        <tr
                                            key={expense.id}
                                            className="border-b border-neutral-200 last:border-0 dark:border-neutral-700"
                                        >
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium">
                                                        {expense.title}
                                                    </p>
                                                    {expense.notes && (
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                            {expense.notes.substring(
                                                                0,
                                                                50,
                                                            )}
                                                            {expense.notes
                                                                .length > 50 &&
                                                                '...'}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {expense.category && (
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-3 w-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    expense
                                                                        .category
                                                                        .color,
                                                            }}
                                                        />
                                                        <span className="text-sm">
                                                            {
                                                                expense.category
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`font-semibold ${
                                                        expense.type ===
                                                        'income'
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                    }`}
                                                >
                                                    {expense.type === 'income'
                                                        ? '+'
                                                        : '-'}
                                                    {formatCurrency(
                                                        expense.amount,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="capitalize">
                                                    {expense.type}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(expense.priority)}`}
                                                >
                                                    {expense.priority}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {formatDate(expense.date)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/expenses/${expense.id}/edit`}
                                                        className="rounded p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        aria-label={`Edit ${expense.title}`}
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                expense.id,
                                                            )
                                                        }
                                                        className="rounded p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        aria-label={`Delete ${expense.title}`}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-neutral-600 dark:text-neutral-400"
                                        >
                                            No expenses found. Create your first
                                            expense to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {expenses.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 p-4 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Showing {expenses.data.length} of{' '}
                                {expenses.total} expenses
                            </p>
                            <div className="flex gap-2">
                                {Array.from(
                                    { length: expenses.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Link
                                        key={page}
                                        href="/expenses"
                                        data={{
                                            page,
                                            search,
                                            category_id: categoryFilter,
                                            type: typeFilter,
                                            priority: priorityFilter,
                                        }}
                                        className={`rounded px-3 py-1 ${
                                            page === expenses.current_page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
