<?php

namespace Database\Seeders;

use App\Models\Bill;
use App\Models\Category;
use App\Models\Goal;
use App\Models\RecurrentTransaction;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
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

        $user->forceFill(['email_verified_at' => now()])->save();

        $categories = $this->categories($user);

        $this->seedClientBills($user, $categories);
        $this->seedSupplierBills($user, $categories);
        $this->seedTransactions($user, $categories);
        $this->seedGoals($user);
        $this->seedFixedMovements($user, $categories);
    }

    private function categories(User $user): array
    {
        $defaults = [
            'Alimentacion',
            'Transporte',
            'Vivienda',
            'Salud',
            'Ocio',
            'Nomina',
            'Otros',
        ];

        $categories = [];

        foreach ($defaults as $name) {
            $categories[$name] = Category::where('name', $name)->whereNull('user_id')->first();
        }

        $ownCategories = [
            'Clientes' => ['icon' => 'briefcase', 'color' => '#22C55E'],
            'Software' => ['icon' => 'laptop', 'color' => '#6366F1'],
            'Impuestos' => ['icon' => 'receipt', 'color' => '#F97316'],
            'Coworking' => ['icon' => 'building', 'color' => '#0EA5E9'],
            'Marketing' => ['icon' => 'megaphone', 'color' => '#EC4899'],
            'Formacion' => ['icon' => 'book-open', 'color' => '#A855F7'],
        ];

        foreach ($ownCategories as $name => $data) {
            $categories[$name] = Category::updateOrCreate(
                ['name' => $name, 'user_id' => $user->id],
                $data
            );
        }

        return $categories;
    }

    private function seedClientBills(User $user, array $categories): void
    {
        $clients = [
            ['name' => 'Cliente Norte', 'base' => 1450],
            ['name' => 'Estudio Brava', 'base' => 980],
            ['name' => 'Taller Digital', 'base' => 760],
        ];

        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $client = $clients[$i % count($clients)];
            $amount = $client['base'] + (($i % 4) * 85);
            $date = $month->copy()->day(min(10 + ($i % 8), $month->daysInMonth))->toDateString();
            $name = 'Factura ' . $client['name'] . ' ' . $month->format('m-Y');

            $bill = Bill::updateOrCreate(
                ['user_id' => $user->id, 'name' => $name, 'date' => $date],
                [
                    'category_id' => $categories['Clientes']?->id,
                    'type' => 'recibida',
                    'total_amount' => $amount,
                    'iva_percent' => 21,
                    'client' => $client['name'],
                    'description' => 'Servicios digitales ' . $month->translatedFormat('F Y'),
                    'payment_method' => 'transfer',
                    'plazos' => null,
                ]
            );

            Transaction::updateOrCreate(
                ['user_id' => $user->id, 'name' => $name, 'date' => $date],
                [
                    'bill_id' => $bill->id,
                    'category_id' => $bill->category_id,
                    'type' => 'income',
                    'total_amount' => $bill->total_amount,
                    'iva_percent' => $bill->iva_percent,
                    'client' => $bill->client,
                    'description' => $bill->description,
                    'payment_method' => $bill->payment_method,
                    'status' => true,
                    'recurrent' => false,
                    'recurrent_timer' => null,
                    'is_deductible' => false,
                    'deductible_percent' => null,
                    'tax_note' => null,
                ]
            );
        }
    }

    private function seedSupplierBills(User $user, array $categories): void
    {
        $supplierBills = [
            ['name' => 'Gestoria trimestre Q1', 'monthOffset' => 10, 'amount' => 360, 'category' => 'Impuestos', 'client' => 'Gestoria Central'],
            ['name' => 'Gestoria trimestre Q2', 'monthOffset' => 7, 'amount' => 360, 'category' => 'Impuestos', 'client' => 'Gestoria Central'],
            ['name' => 'Gestoria trimestre Q3', 'monthOffset' => 4, 'amount' => 390, 'category' => 'Impuestos', 'client' => 'Gestoria Central'],
            ['name' => 'Campaña anuncios primavera', 'monthOffset' => 6, 'amount' => 520, 'category' => 'Marketing', 'client' => 'Ads Studio'],
            ['name' => 'Curso avanzado fiscalidad', 'monthOffset' => 3, 'amount' => 240, 'category' => 'Formacion', 'client' => 'Academia Pro'],
        ];

        foreach ($supplierBills as $item) {
            $date = Carbon::now()->subMonths($item['monthOffset'])->day(18)->toDateString();

            $bill = Bill::updateOrCreate(
                ['user_id' => $user->id, 'name' => $item['name'], 'date' => $date],
                [
                    'category_id' => $categories[$item['category']]?->id,
                    'type' => 'emitida',
                    'total_amount' => $item['amount'],
                    'iva_percent' => 21,
                    'client' => $item['client'],
                    'description' => 'Factura de proveedor',
                    'payment_method' => 'transfer',
                    'plazos' => null,
                ]
            );

            Transaction::updateOrCreate(
                ['user_id' => $user->id, 'name' => $item['name'], 'date' => $date],
                [
                    'bill_id' => $bill->id,
                    'category_id' => $bill->category_id,
                    'type' => 'expense',
                    'total_amount' => $bill->total_amount,
                    'iva_percent' => $bill->iva_percent,
                    'client' => $bill->client,
                    'description' => $bill->description,
                    'payment_method' => $bill->payment_method,
                    'status' => true,
                    'recurrent' => false,
                    'recurrent_timer' => null,
                    'is_deductible' => true,
                    'deductible_percent' => 21,
                    'tax_note' => 'Proveedor profesional',
                ]
            );
        }
    }

    private function seedTransactions(User $user, array $categories): void
    {
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthlyExpenses = [
                [
                    'name' => 'Coworking ' . $month->format('m-Y'),
                    'day' => 3,
                    'type' => 'expense',
                    'amount' => 260,
                    'iva' => 21,
                    'category' => 'Coworking',
                    'client' => 'Coworking Centre',
                    'payment' => 'transfer',
                    'deductible' => true,
                    'deductible_percent' => 21,
                    'tax_note' => 'Espacio de trabajo',
                ],
                [
                    'name' => 'Software cloud ' . $month->format('m-Y'),
                    'day' => 7,
                    'type' => 'expense',
                    'amount' => 49.99,
                    'iva' => 21,
                    'category' => 'Software',
                    'client' => 'SaaS Tools',
                    'payment' => 'card',
                    'deductible' => true,
                    'deductible_percent' => 21,
                    'tax_note' => 'Herramienta profesional',
                ],
                [
                    'name' => 'Transporte reuniones ' . $month->format('m-Y'),
                    'day' => 22,
                    'type' => 'expense',
                    'amount' => 34 + ($i % 5) * 6,
                    'iva' => 10,
                    'category' => 'Transporte',
                    'client' => 'Taxi y metro',
                    'payment' => 'card',
                    'deductible' => true,
                    'deductible_percent' => 10,
                    'tax_note' => 'Desplazamientos profesionales',
                ],
            ];

            foreach ($monthlyExpenses as $expense) {
                $date = $month->copy()->day(min($expense['day'], $month->daysInMonth))->toDateString();

                Transaction::updateOrCreate(
                    ['user_id' => $user->id, 'name' => $expense['name'], 'date' => $date],
                    [
                        'category_id' => $categories[$expense['category']]?->id,
                        'type' => $expense['type'],
                        'total_amount' => $expense['amount'],
                        'iva_percent' => $expense['iva'],
                        'client' => $expense['client'],
                        'description' => 'Movimiento de actividad mensual',
                        'payment_method' => $expense['payment'],
                        'status' => true,
                        'recurrent' => true,
                        'recurrent_timer' => 'monthly',
                        'is_deductible' => $expense['deductible'],
                        'deductible_percent' => $expense['deductible_percent'],
                        'tax_note' => $expense['tax_note'],
                    ]
                );
            }
        }

        $oneOffs = [
            ['name' => 'Compra monitor 4K', 'months' => 9, 'day' => 12, 'amount' => 420, 'category' => 'Software', 'client' => 'Tech Store'],
            ['name' => 'Cena con cliente', 'months' => 8, 'day' => 26, 'amount' => 68.40, 'category' => 'Otros', 'client' => 'Restaurante Centro'],
            ['name' => 'Dominio y hosting anual', 'months' => 5, 'day' => 9, 'amount' => 149.90, 'category' => 'Software', 'client' => 'Hosting Pro'],
            ['name' => 'Sesión fotos marca personal', 'months' => 2, 'day' => 14, 'amount' => 310, 'category' => 'Marketing', 'client' => 'Foto Studio'],
        ];

        foreach ($oneOffs as $item) {
            $date = Carbon::now()->subMonths($item['months'])->day($item['day'])->toDateString();

            Transaction::updateOrCreate(
                ['user_id' => $user->id, 'name' => $item['name'], 'date' => $date],
                [
                    'category_id' => $categories[$item['category']]?->id,
                    'type' => 'expense',
                    'total_amount' => $item['amount'],
                    'iva_percent' => 21,
                    'client' => $item['client'],
                    'description' => 'Gasto puntual de actividad',
                    'payment_method' => 'card',
                    'status' => true,
                    'recurrent' => false,
                    'recurrent_timer' => null,
                    'is_deductible' => true,
                    'deductible_percent' => 21,
                    'tax_note' => 'Gasto profesional',
                ]
            );
        }
    }

    private function seedGoals(User $user): void
    {
        $goals = [
            [
                'name' => 'Fondo de emergencia',
                'target_amount' => 6000,
                'current_amount' => 3250,
                'start_date' => Carbon::now()->subMonths(11)->toDateString(),
                'end_date' => Carbon::now()->addMonths(6)->toDateString(),
                'completed' => false,
            ],
            [
                'name' => 'Nuevo portátil',
                'target_amount' => 2200,
                'current_amount' => 1450,
                'start_date' => Carbon::now()->subMonths(7)->toDateString(),
                'end_date' => Carbon::now()->addMonths(3)->toDateString(),
                'completed' => false,
            ],
            [
                'name' => 'Impuestos trimestrales',
                'target_amount' => 2500,
                'current_amount' => 1900,
                'start_date' => Carbon::now()->subMonths(4)->toDateString(),
                'end_date' => Carbon::now()->addMonth()->toDateString(),
                'completed' => false,
            ],
            [
                'name' => 'Formación anual',
                'target_amount' => 1000,
                'current_amount' => 1000,
                'start_date' => Carbon::now()->subMonths(10)->toDateString(),
                'end_date' => Carbon::now()->subMonth()->toDateString(),
                'completed' => true,
            ],
        ];

        foreach ($goals as $goal) {
            Goal::updateOrCreate(
                ['user_id' => $user->id, 'name' => $goal['name']],
                $goal
            );
        }
    }

    private function seedFixedMovements(User $user, array $categories): void
    {
        $fixedMovements = [
            [
                'name' => 'Alquiler local',
                'category' => 'Vivienda',
                'type' => 'expense',
                'amount' => 1200,
                'iva' => 0,
                'client' => 'Arrendador local',
                'description' => 'Alquiler mensual del local de trabajo',
                'payment' => 'transfer',
                'frequency' => 'monthly',
                'day' => 1,
                'deductible' => false,
                'deductible_percent' => null,
                'tax_note' => 'Local afecto a la actividad',
            ],
            [
                'name' => 'Cuota autonomos',
                'category' => 'Impuestos',
                'type' => 'expense',
                'amount' => 310,
                'iva' => 0,
                'client' => 'Seguridad Social',
                'description' => 'Cuota mensual de autonomos',
                'payment' => 'transfer',
                'frequency' => 'monthly',
                'day' => 30,
                'deductible' => false,
                'deductible_percent' => null,
                'tax_note' => 'Cuota profesional',
            ],
            [
                'name' => 'Suscripcion software',
                'category' => 'Software',
                'type' => 'expense',
                'amount' => 49.99,
                'iva' => 21,
                'client' => 'SaaS Tools',
                'description' => 'Herramienta mensual de trabajo',
                'payment' => 'card',
                'frequency' => 'monthly',
                'day' => 15,
                'deductible' => true,
                'deductible_percent' => 21,
                'tax_note' => 'Software profesional',
            ],
            [
                'name' => 'Cliente mantenimiento',
                'category' => 'Clientes',
                'type' => 'income',
                'amount' => 650,
                'iva' => 21,
                'client' => 'Cliente mantenimiento',
                'description' => 'Cuota mensual de mantenimiento',
                'payment' => 'transfer',
                'frequency' => 'monthly',
                'day' => 5,
                'deductible' => false,
                'deductible_percent' => null,
                'tax_note' => null,
            ],
            [
                'name' => 'Auditoria SEO trimestral',
                'category' => 'Clientes',
                'type' => 'income',
                'amount' => 900,
                'iva' => 21,
                'client' => 'Retail SEO',
                'description' => 'Servicio trimestral de auditoria',
                'payment' => 'transfer',
                'frequency' => 'quarterly',
                'day' => 12,
                'deductible' => false,
                'deductible_percent' => null,
                'tax_note' => null,
            ],
        ];

        foreach ($fixedMovements as $item) {
            $startDate = Carbon::now()->subYear()->day(min($item['day'], Carbon::now()->subYear()->daysInMonth));
            $nextRunDate = Carbon::now()->addMonth()->day(min($item['day'], Carbon::now()->addMonth()->daysInMonth));

            RecurrentTransaction::updateOrCreate(
                ['user_id' => $user->id, 'name' => $item['name']],
                [
                    'category_id' => $categories[$item['category']]?->id,
                    'type' => $item['type'],
                    'total_amount' => $item['amount'],
                    'iva_percent' => $item['iva'],
                    'client' => $item['client'],
                    'description' => $item['description'],
                    'payment_method' => $item['payment'],
                    'frequency' => $item['frequency'],
                    'start_date' => $startDate->toDateString(),
                    'next_run_date' => $nextRunDate->toDateString(),
                    'end_date' => null,
                    'active' => true,
                    'is_deductible' => $item['type'] === 'expense' ? $item['deductible'] : false,
                    'deductible_percent' => $item['type'] === 'expense' ? $item['deductible_percent'] : null,
                    'tax_note' => $item['type'] === 'expense' ? $item['tax_note'] : null,
                    'last_generated_at' => Carbon::now()->subMonth(),
                ]
            );
        }
    }
}
