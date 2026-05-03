<?php
namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\User;
use Illuminate\Http\Request;

class BillController extends Controller
{
    // GET BILLS
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->rol != 'gestor') {
            $bills = Bill::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->with(['user', 'category'])
                ->get();
        } else {
            $bills = Bill::with(['user', 'category'])->get();
        }

        return response()->json($bills);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'date'           => 'required|date',
            'type'           => 'required|in:income,expense',
            'total_amount'   => 'required|numeric|min:0',
            'iva_percent'    => 'nullable|numeric|in:0,4,10,21',
            'client'         => 'nullable|string|max:255',
            'description'    => 'nullable|string',
            'payment_method' => 'required|string',
            'plazos'         => 'nullable|boolean',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $bill = Bill::create([
            'user_id'        => $user->id,
            'name'           => $data['name'],
            'date'           => $data['date'],
            'type'           => $data['type'],
            'total_amount'   => $data['total_amount'],
            'iva_percent'    => $data['iva_percent'] ?? 0,
            'client'         => $data['client'] ?? null,
            'description'    => $data['description'] ?? null,
            'payment_method' => $data['payment_method'],
            'plazos'         => $data['plazos'] ?? null,
            'category_id' => $data['category_id'] ?? null,
        ]);

        return response()->json($bill, 201);
    }
}