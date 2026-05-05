<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurrentTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'type',
        'total_amount',
        'iva_percent',
        'client',
        'description',
        'payment_method',
        'frequency',
        'start_date',
        'next_run_date',
        'end_date',
        'active',
        'is_deductible',
        'deductible_percent',
        'tax_note',
        'last_generated_at',
    ];

    protected $casts = [
        'active' => 'boolean',
        'is_deductible' => 'boolean',
        'start_date' => 'date',
        'next_run_date' => 'date',
        'end_date' => 'date',
        'last_generated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
