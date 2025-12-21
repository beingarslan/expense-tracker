<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\RecurringPaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Expense routes
    Route::resource('expenses', ExpenseController::class);

    // Category routes
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);

    // Recurring payment routes
    Route::resource('recurring-payments', RecurringPaymentController::class)->except(['create', 'show', 'edit']);
});

require __DIR__.'/settings.php';
