<?php

namespace App\Http\Controllers;

use App\Models\RecurrentTransaction;
use App\Services\RecurrentTransactionGenerator;
use Illuminate\Http\Request;

class RecurrentTransactionController extends Controller
{
    // The generator service creates real transactions from recurrent transactions.
    public function __construct(private RecurrentTransactionGenerator $generator)
    {
    }

    // Return all recurrent transactions that belong to the logged user.
    public function index(Request $request)
    {
        $user = $request->user();

        // Load category and user data so the frontend has all needed information.
        $recurrentTransactions = RecurrentTransaction::where('user_id', $user->id)
            ->orderBy('next_run_date', 'asc')
            ->with(['category', 'user'])
            ->get();

        return response()->json($recurrentTransactions);
    }

    // Create a new recurrent transaction for the logged user.
    public function store(Request $request)
    {
        $user = $request->user();

        // Validate the form data before saving it.
        $data = $this->validateRecurrent($request);

        // Save the recurrent transaction with default values for optional fields.
        $recurrentTransaction = RecurrentTransaction::create([
            ...$data,
            'user_id' => $user->id,
            'iva_percent' => $data['iva_percent'] ?? 0,
            'client' => $data['client'] ?? null,
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'active' => $data['active'] ?? true,
            'creates_bill' => $data['creates_bill'] ?? false,
        ]);

        // After saving, generate pending transactions for this user if some are due.
        $this->generator->generateDue($user->id);

        // Return the new recurrent transaction with its relations loaded.
        return response()->json($recurrentTransaction->fresh(['category', 'user']), 201);
    }

    // Update an existing recurrent transaction.
    public function update(Request $request, int $id)
    {
        $user = $request->user();
        $recurrentTransaction = RecurrentTransaction::find($id);

        // If the recurrent transaction does not exist, return a 404 error.
        if (!$recurrentTransaction) {
            return response()->json(['message' => 'Recurrent transaction not found'], 404);
        }

        // A user can only update their own recurrent transactions.
        if ($user->id != $recurrentTransaction->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Validate the new data before updating.
        $data = $this->validateRecurrent($request);

        // Update the recurrent transaction and keep safe defaults for optional fields.
        $recurrentTransaction->update([
            ...$data,
            'iva_percent' => $data['iva_percent'] ?? 0,
            'client' => $data['client'] ?? null,
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'active' => $data['active'] ?? true,
            'creates_bill' => $data['creates_bill'] ?? false,
        ]);

        // If the updated recurrent transaction is already due, generate it now.
        $this->generator->generateDue($user->id);

        return response()->json($recurrentTransaction->fresh(['category', 'user']));
    }

    // Delete a recurrent transaction.
    public function delete(Request $request, int $id)
    {
        $user = $request->user();
        $recurrentTransaction = RecurrentTransaction::find($id);

        // If the recurrent transaction does not exist, return a 404 error.
        if (!$recurrentTransaction) {
            return response()->json(['message' => 'Recurrent transaction not found'], 404);
        }

        // A user can only delete their own recurrent transactions.
        if ($user->id != $recurrentTransaction->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Remove the recurrent transaction from the database.
        $recurrentTransaction->delete();

        return response()->json(['message' => 'Recurrent transaction deleted successfully'], 200);
    }

    // Manually generate the next real transaction from one recurrent transaction.
    public function generateNext(Request $request, int $id)
    {
        $user = $request->user();
        $recurrentTransaction = RecurrentTransaction::find($id);

        // If the recurrent transaction does not exist, return a 404 error.
        if (!$recurrentTransaction) {
            return response()->json(['message' => 'Recurrent transaction not found'], 404);
        }

        // A user can only generate their own recurrent transactions.
        if ($user->id != $recurrentTransaction->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Paused recurrent transactions cannot generate new transactions.
        if (!$recurrentTransaction->active) {
            return response()->json(['message' => 'Recurrent transaction is paused'], 422);
        }

        // If the recurrent transaction already passed its end date, do not generate it.
        if ($recurrentTransaction->end_date && $recurrentTransaction->next_run_date->gt($recurrentTransaction->end_date)) {
            return response()->json(['message' => 'Recurrent transaction has ended'], 422);
        }

        // Use the generator service to create the transaction and update the next run date.
        $transaction = $this->generator->generateNext($recurrentTransaction);

        // Return both the created transaction and the updated recurrent transaction.
        return response()->json([
            'transaction' => $transaction->load(['category', 'user', 'bill']),
            'recurrent_transaction' => $recurrentTransaction->fresh(['category', 'user']),
        ], 201);
    }

    // Validate the fields used to create or update a recurrent transaction.
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
            'creates_bill' => 'nullable|boolean',
        ]);
    }

}
