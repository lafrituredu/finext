<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Autonomo extends Model
{
    public $timestamps = false;

    protected $primaryKey = 'user_id';

    public $incrementing = false;

    protected $fillable = [
    'user_id',
    'dni',
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
