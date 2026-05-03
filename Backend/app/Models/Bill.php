<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $fillable = [
    'user_id',
    'category_id',
    'name',
    'date',
    'type',
    'total_amount',
    'iva_percent',
    'client',
    'description',
    'payment_method',
    'plazos'
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
