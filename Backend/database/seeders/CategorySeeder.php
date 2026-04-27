<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Alimentacion',
                'icon' => 'shopping-cart',
                'color' => '#F59E0B',
                'user_id' => null,
            ],
            [
                'name' => 'Transporte',
                'icon' => 'car',
                'color' => '#3B82F6',
                'user_id' => null,
            ],
            [
                'name' => 'Vivienda',
                'icon' => 'home',
                'color' => '#10B981',
                'user_id' => null,
            ],
            [
                'name' => 'Salud',
                'icon' => 'heart',
                'color' => '#EF4444',
                'user_id' => null,
            ],
            [
                'name' => 'Ocio',
                'icon' => 'sparkles',
                'color' => '#8B5CF6',
                'user_id' => null,
            ],
            [
                'name' => 'Nomina',
                'icon' => 'wallet',
                'color' => '#14B8A6',
                'user_id' => null,
            ],
            [
                'name' => 'Otros',
                'icon' => 'dots-horizontal',
                'color' => '#6B7280',
                'user_id' => null,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                [
                    'name' => $category['name'],
                    'user_id' => null,
                ],
                $category
            );
        }
    }
}
