<?php

use App\Models\FinancialGoal;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('user can view their financial goals', function () {
    $user = User::factory()->create();
    
    FinancialGoal::factory()->create([
        'user_id' => $user->id,
        'title' => 'Buy a Car',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('financial-goals.index'));

    $response->assertOk();
});

test('user can create a financial goal', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('financial-goals.store'), [
            'title' => 'Save for Vacation',
            'description' => 'Trip to Europe',
            'target_amount' => 5000,
            'current_amount' => 1000,
            'target_date' => now()->addMonths(6)->format('Y-m-d'),
            'priority' => 'high',
            'notes' => 'Need to save $1000 per month',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('financial-goals.index'));

    $goal = FinancialGoal::where('user_id', $user->id)->first();
    
    expect($goal->title)->toBe('Save for Vacation');
    expect($goal->target_amount)->toBe('5000.00');
    expect($goal->current_amount)->toBe('1000.00');
    expect($goal->status)->toBe('active');
});

test('user can update a financial goal', function () {
    $user = User::factory()->create();
    
    $goal = FinancialGoal::factory()->create([
        'user_id' => $user->id,
        'title' => 'Original Title',
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('financial-goals.update', $goal), [
            'title' => 'Updated Title',
            'description' => $goal->description,
            'target_amount' => $goal->target_amount,
            'current_amount' => $goal->current_amount,
            'target_date' => $goal->target_date->format('Y-m-d'),
            'status' => 'completed',
            'priority' => $goal->priority,
            'notes' => $goal->notes,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('financial-goals.index'));

    $goal->refresh();
    
    expect($goal->title)->toBe('Updated Title');
    expect($goal->status)->toBe('completed');
});

test('user can delete a financial goal', function () {
    $user = User::factory()->create();
    
    $goal = FinancialGoal::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->delete(route('financial-goals.destroy', $goal));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('financial-goals.index'));

    expect($goal->fresh())->toBeNull();
});

test('user cannot access other users financial goals', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    
    $goal = FinancialGoal::factory()->create([
        'user_id' => $user2->id,
    ]);

    $response = $this
        ->actingAs($user1)
        ->delete(route('financial-goals.destroy', $goal));

    $response->assertForbidden();
    
    expect($goal->fresh())->not->toBeNull();
});

test('target date must be today or in the future', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('financial-goals.store'), [
            'title' => 'Invalid Goal',
            'target_amount' => 1000,
            'target_date' => now()->subDay()->format('Y-m-d'),
            'priority' => 'medium',
        ]);

    $response->assertSessionHasErrors('target_date');
});
