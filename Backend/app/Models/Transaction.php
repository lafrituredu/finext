<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
    'user_id',
    'bill_id',
    'category_id',
    'name',
    'date',
    'type',
    'total_amount',
    'iva_percent',
    'client',
    'description',
    'payment_method',
    'status',
    'recurrent',
    'recurrent_timer'
    ];
    public function user()
    {
    return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function bill()
    {
        return $this->belongsTo(Bill::class, 'bill_id');
    }
}
