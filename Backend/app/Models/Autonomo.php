<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Autonomo extends Model
{
    protected $fillable = [
    'user_id',
    'birth_date',
    'modulo_iva',
    'civil_state',
    'company',
    'irpf'
    ];
    public function user()
    {
    return $this->belongsTo(User::class);
    }
}
