<?php

namespace App\Http\Controllers;

use App\Models\FinancialGoal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialGoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FinancialGoal::where('user_id', auth()->id())
            ->orderBy('target_date', 'asc');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        $goals = $query->paginate(20)->withQueryString();

        return Inertia::render('financial-goals/index', [
            'goals' => $goals,
            'filters' => $request->only(['status', 'priority']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'target_date' => 'required|date|after:today',
            'priority' => 'required|in:low,medium,high',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['current_amount'] = $validated['current_amount'] ?? 0;
        $validated['status'] = 'active';

        FinancialGoal::create($validated);

        return redirect()->route('financial-goals.index')->with('success', 'Financial goal created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinancialGoal $financialGoal)
    {
        if ($financialGoal->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'target_date' => 'required|date',
            'status' => 'required|in:active,completed,cancelled',
            'priority' => 'required|in:low,medium,high',
            'notes' => 'nullable|string',
        ]);

        $financialGoal->update($validated);

        return redirect()->route('financial-goals.index')->with('success', 'Financial goal updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinancialGoal $financialGoal)
    {
        if ($financialGoal->user_id !== auth()->id()) {
            abort(403);
        }

        $financialGoal->delete();

        return redirect()->route('financial-goals.index')->with('success', 'Financial goal deleted successfully.');
    }
}
