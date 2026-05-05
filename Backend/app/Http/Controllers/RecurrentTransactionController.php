<?php

namespace App\Http\Controllers;

use App\Models\RecurrentTransaction;
use App\Services\RecurrentTransactionGenerator;
use Illuminate\Http\Request;

class RecurrentTransactionController extends Controller
{
    public function __construct(private RecurrentTransactionGenerator $generator)
    {
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->rol != 'gestor') {
            $recurrentTransactions = RecurrentTransaction::where('user_id', $user->id)
                ->orderBy('next_run_date', 'asc')
                ->with(['category', 'user'])
                ->get();
        } else {
            $recurrentTransactions = RecurrentTransaction::with(['category', 'user'])
                ->orderBy('next_run_date', 'asc')
                ->get();
        }

        return response()->json($recurrentTransactions);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $data = $this->validateRecurrent($request);

        $recurrentTransaction = RecurrentTransaction::create([
            ...$data,
            'user_id' => $user->id,
            'iva_percent' => $data['iva_percent'] ?? 0,
            'client' => $data['client'] ?? null,
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'active' => $data['active'] ?? true,
            'is_deductible' => $data['type'] === 'expense' && ($data['iva_percent'] ?? 0) > 0 ? ($data['is_deductible'] ?? false) : false,
            'deductible_percent' => $data['type'] === 'expense' && ($data['iva_percent'] ?? 0) > 0 && ($data['is_deductible'] ?? false) ? ($data['iva_percent'] ?? 0) : null,
            'tax_note' => null,
        ]);

        return response()->json($recurrentTransaction->load(['category', 'user']), 201);
    }

    public function update(Request $request, int $id)
    {
        $user = $request->user();
        $recurrentTransaction = RecurrentTransaction::find($id);

        if (!$recurrentTransaction) {
            return response()->json(['message' => 'Recurrent transaction not found'], 404);
        }

        if ($user->id != $recurrentTransaction->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $this->validateRecurrent($request);

        $recurrentTransaction->update([
            ...$data,
            'iva_percent' => $data['iva_percent'] ?? 0,
            'client' => $data['client'] ?? null,
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'active' => $data['active'] ?? true,
            'is_deductible' => $data['type'] === 'expense' && ($data['iva_percent'] ?? 0) > 0 ? ($data['is_deductible'] ?? false) : false,
            'deductible_percent' => $data['type'] === 'expense' && ($data['iva_percent'] ?? 0) > 0 && ($data['is_deductible'] ?? false) ? ($data['iva_percent'] ?? 0) : null,
            'tax_note' => null,
        ]);

        return response()->json($recurrentTransaction->fresh(['category', 'user']));
    }

    public function delete(Request $request, int $id)
    {
        $user = $request->user();
        $recurrentTransaction = RecurrentTransaction::find($id);

        if (!$recurrentTransaction) {
            return response()->json(['message' => 'Recurrent transaction not found'], 404);
        }

        if ($user->id != $recurrentTransaction->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $recurrentTransaction->delete();

        return response()->json(['message' => 'Recurrent transaction deleted successfully'], 200);
    }

    public function generateNext(Request $request, int $id)
    {
        $user = $request->user();
        $recurrentTransaction = RecurrentTransaction::find($id);

        if (!$recurrentTransaction) {
            return response()->json(['message' => 'Recurrent transaction not found'], 404);
        }

        if ($user->id != $recurrentTransaction->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!$recurrentTransaction->active) {
            return response()->json(['message' => 'Recurrent transaction is paused'], 422);
        }

        if ($recurrentTransaction->end_date && $recurrentTransaction->next_run_date->gt($recurrentTransaction->end_date)) {
            return response()->json(['message' => 'Recurrent transaction has ended'], 422);
        }

        $transaction = $this->generator->generateNext($recurrentTransaction);

        return response()->json([
            'transaction' => $transaction->load(['category', 'user']),
            'recurrent_transaction' => $recurrentTransaction->fresh(['category', 'user']),
        ], 201);
    }

    private function validateRecurrent(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'total_amount' => 'required|numeric|min:0.01',
            'iva_percent' => 'nullable|numeric|in:0,4,10,21',
            'client' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'payment_method' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'frequency' => 'required|in:weekly,monthly,quarterly,yearly',
            'start_date' => 'required|date',
            'next_run_date' => 'required|date|after_or_equal:start_date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'active' => 'nullable|boolean',
            'is_deductible' => 'nullable|boolean',
            'deductible_percent' => 'nullable|numeric|min:0|max:100',
            'tax_note' => 'nullable|string|max:255',
        ]);
    }

}
