<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Expense::with('category')
            ->where('user_id', auth()->id())
            ->orderBy('date', 'desc');

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->where('date', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->where('date', '<=', $request->end_date);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhere('notes', 'like', '%'.$request->search.'%');
            });
        }

        $expenses = $query->paginate(20)->withQueryString();
        
        // If the requested page is out of range, redirect to the last available page
        if ($expenses->currentPage() > $expenses->lastPage() && $expenses->lastPage() > 0) {
            return redirect()->route('expenses.index', array_merge(
                $request->only(['category_id', 'type', 'priority', 'start_date', 'end_date', 'search']),
                ['page' => $expenses->lastPage()]
            ));
        }
        
        $categories = Category::where('user_id', auth()->id())->get();

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'type', 'priority', 'start_date', 'end_date', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('user_id', auth()->id())->get();

        return Inertia::render('expenses/create', [
            'categories' => $categories,
            'userCurrency' => auth()->user()->preferred_currency ?? 'USD',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'type' => 'required|in:income,expense',
            'category_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if ($value && !Category::where('id', $value)->where('user_id', auth()->id())->exists()) {
                        $fail('The selected category does not belong to you.');
                    }
                },
            ],
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'is_recurring' => 'boolean',
        ]);

        $validated['user_id'] = auth()->id();
        if (!isset($validated['currency'])) {
            $validated['currency'] = auth()->user()->preferred_currency ?? 'USD';
        }

        Expense::create($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }

        $expense->load('category');

        return Inertia::render('expenses/show', [
            'expense' => $expense,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = Category::where('user_id', auth()->id())->get();

        return Inertia::render('expenses/edit', [
            'expense' => $expense,
            'categories' => $categories,
            'userCurrency' => auth()->user()->preferred_currency ?? 'USD',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'type' => 'required|in:income,expense',
            'category_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if ($value && !Category::where('id', $value)->where('user_id', auth()->id())->exists()) {
                        $fail('The selected category does not belong to you.');
                    }
                },
            ],
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'is_recurring' => 'boolean',
        ]);

        if (!isset($validated['currency'])) {
            $validated['currency'] = $expense->currency ?? 'USD';
        }

        $expense->update($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }

        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully.');
    }
}
