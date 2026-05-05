<?php

namespace Database\Seeders;

use App\Models\Bill;
use App\Models\Category;
use App\Models\Goal;
use App\Models\RecurrentTransaction;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'marc.gilavert05@gmail.com'],
            [
                'username' => 'marc_gilavert',
                'full_name' => 'Marc Gilavert',
                'rol' => 'autonomo',
                'phone_number' => '600000000',
                'password' => '1234567@',
            ]
        );

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        $categories = [
            'Vivienda' => Category::where('name', 'Vivienda')->whereNull('user_id')->first(),
            'Transporte' => Category::where('name', 'Transporte')->whereNull('user_id')->first(),
            'Nomina' => Category::where('name', 'Nomina')->whereNull('user_id')->first(),
            'Otros' => Category::where('name', 'Otros')->whereNull('user_id')->first(),
        ];

        $categories['Software'] = Category::updateOrCreate(
            ['name' => 'Software', 'user_id' => $user->id],
            ['icon' => 'laptop', 'color' => '#6366F1']
        );

        $categories['Impuestos'] = Category::updateOrCreate(
            ['name' => 'Impuestos', 'user_id' => $user->id],
            ['icon' => 'receipt', 'color' => '#F97316']
        );

        $categories['Clientes'] = Category::updateOrCreate(
            ['name' => 'Clientes', 'user_id' => $user->id],
            ['icon' => 'briefcase', 'color' => '#22C55E']
        );

        $billOne = Bill::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Factura web corporativa', 'date' => now()->subDays(12)->toDateString()],
            [
                'category_id' => $categories['Clientes']?->id,
                'type' => 'recibida',
                'total_amount' => 1450.00,
                'iva_percent' => 21,
                'client' => 'Cliente Norte',
                'description' => 'Desarrollo web mensual',
                'payment_method' => 'transfer',
                'plazos' => null,
            ]
        );

        $billTwo = Bill::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Factura gestoría trimestral', 'date' => now()->subDays(4)->toDateString()],
            [
                'category_id' => $categories['Impuestos']?->id,
                'type' => 'emitida',
                'total_amount' => 360.00,
                'iva_percent' => 21,
                'client' => 'Gestoria Central',
                'description' => 'Servicio fiscal trimestral',
                'payment_method' => 'transfer',
                'plazos' => null,
            ]
        );

        Transaction::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Factura web corporativa', 'date' => $billOne->date],
            [
                'bill_id' => $billOne->id,
                'category_id' => $billOne->category_id,
                'type' => 'income',
                'total_amount' => $billOne->total_amount,
                'iva_percent' => $billOne->iva_percent,
                'client' => $billOne->client,
                'description' => $billOne->description,
                'payment_method' => $billOne->payment_method,
                'status' => true,
                'recurrent' => false,
                'recurrent_timer' => null,
                'is_deductible' => false,
                'deductible_percent' => null,
                'tax_note' => null,
            ]
        );

        Transaction::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Factura gestoría trimestral', 'date' => $billTwo->date],
            [
                'bill_id' => $billTwo->id,
                'category_id' => $billTwo->category_id,
                'type' => 'expense',
                'total_amount' => $billTwo->total_amount,
                'iva_percent' => $billTwo->iva_percent,
                'client' => $billTwo->client,
                'description' => $billTwo->description,
                'payment_method' => $billTwo->payment_method,
                'status' => true,
                'recurrent' => false,
                'recurrent_timer' => null,
                'is_deductible' => true,
                'deductible_percent' => 100,
                'tax_note' => 'Servicio profesional deducible',
            ]
        );

        $transactions = [
            [
                'name' => 'Cobro proyecto landing',
                'date' => now()->subDays(20)->toDateString(),
                'type' => 'income',
                'total_amount' => 900.00,
                'iva_percent' => 21,
                'category_id' => $categories['Clientes']?->id,
                'client' => 'Cliente Sur',
                'description' => 'Entrega landing page',
                'payment_method' => 'transfer',
            ],
            [
                'name' => 'Material oficina',
                'date' => now()->subDays(8)->toDateString(),
                'type' => 'expense',
                'total_amount' => 86.50,
                'iva_percent' => 21,
                'category_id' => $categories['Otros']?->id,
                'client' => 'Papeleria Local',
                'description' => 'Material de trabajo',
                'payment_method' => 'card',
                'is_deductible' => true,
                'deductible_percent' => 100,
                'tax_note' => 'Material profesional',
            ],
            [
                'name' => 'Taxi visita cliente',
                'date' => now()->subDays(2)->toDateString(),
                'type' => 'expense',
                'total_amount' => 24.80,
                'iva_percent' => 10,
                'category_id' => $categories['Transporte']?->id,
                'client' => 'Taxi',
                'description' => 'Desplazamiento a reunión',
                'payment_method' => 'card',
                'is_deductible' => true,
                'deductible_percent' => 100,
                'tax_note' => 'Desplazamiento profesional',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::updateOrCreate(
                ['user_id' => $user->id, 'name' => $transaction['name'], 'date' => $transaction['date']],
                [
                    'category_id' => $transaction['category_id'],
                    'type' => $transaction['type'],
                    'total_amount' => $transaction['total_amount'],
                    'iva_percent' => $transaction['iva_percent'],
                    'client' => $transaction['client'],
                    'description' => $transaction['description'],
                    'payment_method' => $transaction['payment_method'],
                    'status' => true,
                    'recurrent' => false,
                    'recurrent_timer' => null,
                    'is_deductible' => $transaction['is_deductible'] ?? false,
                    'deductible_percent' => $transaction['deductible_percent'] ?? null,
                    'tax_note' => $transaction['tax_note'] ?? null,
                ]
            );
        }

        Goal::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Fondo de emergencia'],
            [
                'target_amount' => 3000,
                'current_amount' => 850,
                'start_date' => now()->subMonth()->toDateString(),
                'end_date' => now()->addMonths(8)->toDateString(),
                'completed' => false,
            ]
        );

        Goal::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Nuevo portátil'],
            [
                'target_amount' => 1800,
                'current_amount' => 400,
                'start_date' => now()->subWeeks(2)->toDateString(),
                'end_date' => now()->addMonths(5)->toDateString(),
                'completed' => false,
            ]
        );

        RecurrentTransaction::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Alquiler local'],
            [
                'category_id' => $categories['Vivienda']?->id,
                'type' => 'expense',
                'total_amount' => 1200.00,
                'iva_percent' => 0,
                'client' => 'Arrendador local',
                'description' => 'Alquiler mensual del local de trabajo',
                'payment_method' => 'transfer',
                'frequency' => 'monthly',
                'start_date' => now()->startOfMonth()->toDateString(),
                'next_run_date' => now()->addMonth()->startOfMonth()->toDateString(),
                'end_date' => null,
                'active' => true,
                'is_deductible' => true,
                'deductible_percent' => 100,
                'tax_note' => 'Local afecto a la actividad',
            ]
        );

        RecurrentTransaction::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Suscripción software'],
            [
                'category_id' => $categories['Software']?->id,
                'type' => 'expense',
                'total_amount' => 49.99,
                'iva_percent' => 21,
                'client' => 'SaaS Tools',
                'description' => 'Herramienta mensual de trabajo',
                'payment_method' => 'card',
                'frequency' => 'monthly',
                'start_date' => now()->subMonth()->day(15)->toDateString(),
                'next_run_date' => now()->addMonth()->day(15)->toDateString(),
                'end_date' => null,
                'active' => true,
                'is_deductible' => true,
                'deductible_percent' => 100,
                'tax_note' => 'Software profesional',
            ]
        );

        RecurrentTransaction::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Cliente mantenimiento'],
            [
                'category_id' => $categories['Clientes']?->id,
                'type' => 'income',
                'total_amount' => 650.00,
                'iva_percent' => 21,
                'client' => 'Cliente mantenimiento',
                'description' => 'Cuota mensual de mantenimiento',
                'payment_method' => 'transfer',
                'frequency' => 'monthly',
                'start_date' => now()->startOfMonth()->toDateString(),
                'next_run_date' => now()->addMonth()->startOfMonth()->toDateString(),
                'end_date' => null,
                'active' => true,
                'is_deductible' => false,
                'deductible_percent' => null,
                'tax_note' => null,
            ]
        );
    }
}
