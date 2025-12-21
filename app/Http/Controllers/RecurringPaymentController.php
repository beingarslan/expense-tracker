<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\RecurringPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecurringPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = RecurringPayment::with('category')
            ->where('user_id', auth()->id())
            ->orderBy('next_payment_date')
            ->get();

        $categories = Category::where('user_id', auth()->id())->get();

        return Inertia::render('recurring-payments/index', [
            'payments' => $payments,
            'categories' => $categories,
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
            'category_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($request) {
                    if ($value && !Category::where('id', $value)->where('user_id', auth()->id())->exists()) {
                        $fail('The selected category does not belong to you.');
                    }
                },
            ],
            'frequency' => 'required|in:daily,weekly,monthly,yearly',
            'start_date' => 'required|date',
            'next_payment_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,paused,completed',
        ]);

        $validated['user_id'] = auth()->id();

        RecurringPayment::create($validated);

        return redirect()->route('recurring-payments.index')->with('success', 'Recurring payment created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RecurringPayment $recurringPayment)
    {
        if ($recurringPayment->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($request) {
                    if ($value && !Category::where('id', $value)->where('user_id', auth()->id())->exists()) {
                        $fail('The selected category does not belong to you.');
                    }
                },
            ],
            'frequency' => 'required|in:daily,weekly,monthly,yearly',
            'start_date' => 'required|date',
            'next_payment_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,paused,completed',
        ]);

        $recurringPayment->update($validated);

        return redirect()->route('recurring-payments.index')->with('success', 'Recurring payment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RecurringPayment $recurringPayment)
    {
        if ($recurringPayment->user_id !== auth()->id()) {
            abort(403);
        }

        $recurringPayment->delete();

        return redirect()->route('recurring-payments.index')->with('success', 'Recurring payment deleted successfully.');
    }
}
