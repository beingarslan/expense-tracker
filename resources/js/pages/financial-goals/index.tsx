import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { PlusCircle, Trash2, Edit, Target } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Financial Goals',
        href: '/financial-goals',
    },
];

interface FinancialGoal {
    id: number;
    title: string;
    description?: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    status: string;
    priority: string;
    notes?: string;
    progress_percentage: number;
    remaining_amount: number;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: FinancialGoal[];
}

interface FinancialGoalsProps {
    goals: PaginationData;
    filters: {
        status?: string;
        priority?: string;
    };
}

export default function FinancialGoalsIndex({
    goals,
    filters,
}: FinancialGoalsProps) {
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth.user.preferred_currency || 'USD';

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        target_amount: '',
        current_amount: '0',
        target_date: '',
        priority: 'medium',
        notes: '',
        status: 'active',
    });

    const handleFilter = () => {
        router.get(
            '/financial-goals',
            {
                status: statusFilter,
                priority: priorityFilter,
                page: 1,
            },
            { preserveState: true },
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingGoal) {
            put(`/financial-goals/${editingGoal.id}`, {
                onSuccess: () => {
                    setShowCreateModal(false);
                    setEditingGoal(null);
                    reset();
                },
            });
        } else {
            post('/financial-goals', {
                onSuccess: () => {
                    setShowCreateModal(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (goal: FinancialGoal) => {
        setEditingGoal(goal);
        setData({
            title: goal.title,
            description: goal.description || '',
            target_amount: goal.target_amount.toString(),
            current_amount: goal.current_amount.toString(),
            target_date: goal.target_date,
            priority: goal.priority,
            notes: goal.notes || '',
            status: goal.status,
        });
        setShowCreateModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this financial goal?')) {
            router.delete(`/financial-goals/${id}`);
        }
    };

    const handleCancel = () => {
        setShowCreateModal(false);
        setEditingGoal(null);
        reset();
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Financial Goals" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Financial Goals</h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Plan and track your future financial objectives
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <PlusCircle size={20} />
                        Add Goal
                    </button>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
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

                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Goals Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {goals.data.length > 0 ? (
                        goals.data.map((goal) => (
                            <div
                                key={goal.id}
                                className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Target
                                            className="text-blue-600"
                                            size={24}
                                        />
                                        <h3 className="font-semibold text-lg">
                                            {goal.title}
                                        </h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(goal)}
                                            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {goal.description && (
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                        {goal.description}
                                    </p>
                                )}

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
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
                                        <div className="h-2 bg-neutral-200 rounded-full dark:bg-neutral-700">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
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

                                    <div className="text-sm">
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            Target Date
                                        </p>
                                        <p className="font-medium">
                                            {formatDate(goal.target_date)}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(goal.priority)}`}
                                        >
                                            {goal.priority}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(goal.status)}`}
                                        >
                                            {goal.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-sidebar-border/70 bg-white p-8 text-center dark:border-sidebar-border dark:bg-neutral-900">
                            <Target
                                className="mx-auto mb-4 text-neutral-400"
                                size={48}
                            />
                            <p className="text-neutral-600 dark:text-neutral-400">
                                No financial goals found. Create your first goal
                                to start planning!
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {goals.last_page > 1 && (
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-neutral-900">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Showing {goals.data.length} of {goals.total} goals
                        </p>
                        <div className="flex gap-2">
                            {Array.from(
                                { length: goals.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Link
                                    key={page}
                                    href="/financial-goals"
                                    data={{
                                        page,
                                        status: statusFilter,
                                        priority: priorityFilter,
                                    }}
                                    className={`rounded px-3 py-1 ${
                                        page === goals.current_page
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

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h2 className="mb-4 text-xl font-bold">
                            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Title *
                                </label>
                                <input
                                    type="text"
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

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Target Amount *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.target_amount}
                                        onChange={(e) =>
                                            setData(
                                                'target_amount',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                        required
                                    />
                                    {errors.target_amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.target_amount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Current Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.current_amount}
                                        onChange={(e) =>
                                            setData(
                                                'current_amount',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                    />
                                    {errors.current_amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.current_amount}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Target Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.target_date}
                                        onChange={(e) =>
                                            setData('target_date', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                        required
                                    />
                                    {errors.target_date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.target_date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Priority *
                                    </label>
                                    <select
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
                            </div>

                            {editingGoal && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Notes
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    rows={4}
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
                                    {processing
                                        ? 'Saving...'
                                        : editingGoal
                                          ? 'Update Goal'
                                          : 'Create Goal'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-lg border border-neutral-300 px-6 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
