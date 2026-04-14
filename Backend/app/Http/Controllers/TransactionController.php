<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // GET TRANSACTIONS
    public function index()
    {
        $transactions = Transaction::with(['category' , 'user'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($transactions);
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