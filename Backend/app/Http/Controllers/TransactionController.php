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

}