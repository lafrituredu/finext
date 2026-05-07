<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Bill;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // GET TRANSACTIONS
    public function index(Request $request)
    {
        $user = $request->user();
        if($user->rol != 'gestor'){
            $transactions = Transaction::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->with(['category', 'user', 'bill'])->get();
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
            'iva_percent' => 'numeric|in:0,4,10,21',
            'client' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'payment_method' => 'required|string',
            'status' => 'nullable|boolean',
            'category_id' => 'nullable|exists:categories,id',
            'bill_id' => 'nullable|exists:bills,id',
        ]);

        $transaction = Transaction::create([
            'name' => $data['name'],
            'date' => $data['date'],
            'type' => $data['type'],
            'total_amount' => $data['total_amount'],
            'iva_percent' => $data['iva_percent'],
            'client' => $data['client'] ?? null,
            'description' => $data['description'] ?? null,
            'payment_method' => $data['payment_method'],
            'status' => $data['status'] ?? true,
            'category_id' => $data['category_id'] ?? null,
            'bill_id' => $data['bill_id'] ?? null,
            'user_id' => $user->id,
        ]);

        return response()->json($transaction, 201);
    }
        
    public function update(Request $request, $id)
    {
        logger()->info('Update request data:', $request->all());
        $user = $request->user();
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        if ($user->id != $transaction->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'date'         => 'required|date',
            'type'         => 'required|in:income,expense',
            'total_amount' => 'required|numeric|min:0',
            'iva_percent'  => 'numeric|in:0,4,10,21',
            'client'       => 'nullable|string|max:255',
            'description'  => 'nullable|string',
            'payment_method' => 'required|string',
            'status'       => 'nullable|boolean',
            'category_id'  => 'nullable|exists:categories,id',
            'bill_id' => 'nullable|exists:bills,id',
        ]);

        $transaction->update([
            'name'         => $data['name'],
            'date'         => $data['date'],
            'type'         => $data['type'],
            'total_amount' => $data['total_amount'],
            'iva_percent'  => $data['iva_percent'],
            'client'       => $data['client'] ?? null,
            'description'  => $data['description'] ?? null,
            'payment_method' => $data['payment_method'],
            'status'       => $data['status'] ?? true,
            'category_id'  => $data['category_id'] ?? null,
            'bill_id' => $data['bill_id'] ?? null,
        ]);

        return response()->json($transaction->fresh());
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

    public function getByBill(Request $request, $billId)
    {
        $user = $request->user();
        $transactions = Transaction::where('bill_id', $billId)
            ->where('user_id', $user->id)
            ->get();
        return response()->json($transactions);
    }

}
