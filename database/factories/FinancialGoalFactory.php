<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FinancialGoal>
 */
class FinancialGoalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'target_amount' => fake()->numberBetween(1000, 100000),
            'current_amount' => fake()->numberBetween(0, 500),
            'target_date' => fake()->dateTimeBetween('now', '+2 years'),
            'status' => fake()->randomElement(['active', 'completed', 'cancelled']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'notes' => fake()->sentence(),
        ];
    }

    /**
     * Indicate that the financial goal is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the financial goal is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'current_amount' => $attributes['target_amount'],
        ]);
    }
}
