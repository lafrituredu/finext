<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // GET TRANSACTIONS
    public function index(Request $request)
    {
        $user = $request->user();
        if($user->rol == 'autonomo'){
            $transactions = Transaction::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->with(['category', 'user'])->get();
        }else{
            $transactions = Transaction::with(['category','user'])->get();
        }
        // $transactions = Transaction::with(['category' , 'user'])
        //     ->orderBy('date', 'desc')
        //     ->get();

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:income,expense',
            'total_amount' => 'required|numeric|min:0',
            'iva_pervent' => 'nullable|numeric|in:4,10,21',
            'client' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $transaction = Transaction::create([
            'name' => $data['name'],
            'date' => $data['date'],
            'type' => $data['type'],
            'total_amount' => $data['total_amount'],
            'iva_pervent' => $data['iva_pervent'] ?? null,
            'client' => $data['client'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? true,
            'category_id' => $data['category_id'] ?? null,
            'user_id' => $user->id,
        ]);

        return response()->json($transaction, 201);
    }

    public function delete($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully'], 200);
    }

}