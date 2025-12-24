import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusCircle, Edit, Trash2, Clock } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Recurring Payments',
        href: '/recurring-payments',
    },
];

interface Category {
    id: number;
    name: string;
    color: string;
}

interface RecurringPayment {
    id: number;
    title: string;
    amount: number;
    currency: string;
    frequency: string;
    next_payment_date: string;
    start_date: string;
    end_date?: string;
    status: string;
    notes?: string;
    category?: Category;
}

interface RecurringPaymentsProps {
    payments: RecurringPayment[];
    categories: Category[];
    userCurrency: string;
}

export default function RecurringPaymentsIndex({
    payments,
    categories,
    userCurrency,
}: RecurringPaymentsProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingPayment, setEditingPayment] =
        useState<RecurringPayment | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        title: '',
        amount: '',
        currency: userCurrency || 'USD',
        category_id: '',
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        next_payment_date: new Date().toISOString().split('T')[0],
        end_date: '',
        notes: '',
        status: 'active',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingPayment) {
            put(`/recurring-payments/${editingPayment.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    setEditingPayment(null);
                },
            });
        } else {
            post('/recurring-payments', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (payment: RecurringPayment) => {
        setEditingPayment(payment);
        
        // Format dates to YYYY-MM-DD for date inputs
        const formatDate = (date: string | undefined) => {
            if (!date) return '';
            const dateObj = new Date(date);
            return dateObj.toISOString().split('T')[0];
        };
        
        setData({
            title: payment.title,
            amount: payment.amount.toString(),
            currency: payment.currency || 'USD',
            category_id: payment.category?.id.toString() || '',
            frequency: payment.frequency,
            start_date: formatDate(payment.start_date),
            next_payment_date: formatDate(payment.next_payment_date),
            end_date: formatDate(payment.end_date),
            notes: payment.notes || '',
            status: payment.status,
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (
            confirm('Are you sure you want to delete this recurring payment?')
        ) {
            router.delete(`/recurring-payments/${id}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPayment(null);
        reset();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'completed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const activePayments = payments.filter((p) => p.status === 'active');
    const inactivePayments = payments.filter((p) => p.status !== 'active');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recurring Payments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Recurring Payments</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <PlusCircle size={20} />
                        Add Recurring Payment
                    </button>
                </div>

                {/* Active Payments */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-semibold">
                        Active Payments
                    </h2>
                    <div className="space-y-3">
                        {activePayments.length > 0 ? (
                            activePayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <Clock
                                            className="text-orange-600 dark:text-orange-400"
                                            size={24}
                                        />
                                        <div>
                                            <h3 className="font-medium">
                                                {payment.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                                {payment.category && (
                                                    <div className="flex items-center gap-1">
                                                        <div
                                                            className="h-2 w-2 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    payment
                                                                        .category
                                                                        .color,
                                                            }}
                                                        />
                                                        <span>
                                                            {
                                                                payment.category
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="capitalize">
                                                    {payment.frequency}
                                                </span>
                                                <span>
                                                    Next:{' '}
                                                    {formatDate(payment.next_payment_date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(payment)
                                                }
                                                className="rounded p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                aria-label={`Edit ${payment.title} payment`}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(payment.id)
                                                }
                                                className="rounded p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                aria-label={`Delete ${payment.title} payment`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-neutral-600 dark:text-neutral-400">
                                No active recurring payments
                            </p>
                        )}
                    </div>
                </div>

                {/* Inactive Payments */}
                {inactivePayments.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h2 className="mb-4 text-lg font-semibold">
                            Inactive Payments
                        </h2>
                        <div className="space-y-3">
                            {inactivePayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="font-medium">
                                                {payment.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(payment.status)}`}
                                                >
                                                    {payment.status}
                                                </span>
                                                <span className="capitalize">
                                                    {payment.frequency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(payment)
                                                }
                                                className="rounded p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                aria-label={`Edit ${payment.title} payment`}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(payment.id)
                                                }
                                                className="rounded p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                aria-label={`Delete ${payment.title} payment`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="payment-modal-title"
                >
                    <div className="max-h-screen w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 dark:bg-neutral-900">
                        <h2 id="payment-modal-title" className="mb-4 text-xl font-bold">
                            {editingPayment
                                ? 'Edit Recurring Payment'
                                : 'Add Recurring Payment'}
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
                                    Amount *
                                </label>
                                <input
                                    type="number"
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
                                <label className="mb-2 block text-sm font-medium">
                                    Currency *
                                </label>
                                <select
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

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Category
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Frequency *
                                </label>
                                <select
                                    value={data.frequency}
                                    onChange={(e) =>
                                        setData('frequency', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData('start_date', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Next Payment *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.next_payment_date}
                                        onChange={(e) =>
                                            setData(
                                                'next_payment_date',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    End Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                />
                            </div>

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
                                    <option value="paused">Paused</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : editingPayment
                                          ? 'Update'
                                          : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
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
