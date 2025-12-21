import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Categories',
        href: '/categories',
    },
];

interface Category {
    id: number;
    name: string;
    type: string;
    color: string;
    description: string;
    expenses_count: number;
    recurring_payments_count: number;
}

interface CategoriesProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        type: 'expense',
        color: '#3b82f6',
        description: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    setEditingCategory(null);
                },
            });
        } else {
            post('/categories', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            type: category.type,
            color: category.color,
            description: category.description || '',
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (
            confirm(
                'Are you sure you want to delete this category? This will set associated expenses to no category.',
            )
        ) {
            router.delete(`/categories/${id}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        reset();
    };

    const expenseCategories = categories.filter((c) => c.type === 'expense');
    const incomeCategories = categories.filter((c) => c.type === 'income');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <PlusCircle size={20} />
                        Add Category
                    </button>
                </div>

                {/* Expense Categories */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-semibold">
                        Expense Categories
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {expenseCategories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-4 w-4 rounded-full"
                                            style={{
                                                backgroundColor: category.color,
                                            }}
                                        />
                                        <div>
                                            <h3 className="font-medium">
                                                {category.name}
                                            </h3>
                                            {category.description && (
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {category.description}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-neutral-500">
                                                {category.expenses_count}{' '}
                                                expenses
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(category)
                                            }
                                            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                            className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Income Categories */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <h2 className="mb-4 text-lg font-semibold">
                        Income Categories
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {incomeCategories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-4 w-4 rounded-full"
                                            style={{
                                                backgroundColor: category.color,
                                            }}
                                        />
                                        <div>
                                            <h3 className="font-medium">
                                                {category.name}
                                            </h3>
                                            {category.description && (
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {category.description}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-neutral-500">
                                                {category.expenses_count}{' '}
                                                transactions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(category)
                                            }
                                            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                            className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-h-screen w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 dark:bg-neutral-900">
                        <h2 className="mb-4 text-xl font-bold">
                            {editingCategory
                                ? 'Edit Category'
                                : 'Add Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Type *
                                </label>
                                <select
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
                                <label className="mb-2 block text-sm font-medium">
                                    Color *
                                </label>
                                <input
                                    type="color"
                                    value={data.color}
                                    onChange={(e) =>
                                        setData('color', e.target.value)
                                    }
                                    className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700"
                                />
                                {errors.color && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.color}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutral-300 py-2 px-3 dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
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
                                        : editingCategory
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
