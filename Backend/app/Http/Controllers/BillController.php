<?php
namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Transaction;
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
        $num = 0;
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'date'           => 'required|date',
            'type'           => 'required|in:recibida,emitida',
            'total_amount'   => 'required|numeric|min:0',
            'iva_percent'    => 'nullable|numeric|in:0,4,10,21',
            'client'         => 'nullable|string|max:255',
            'description'    => 'nullable|string',
            'payment_method' => 'required|string',
            'plazos'         => 'nullable|integer|min:1',
            'category_id'    => 'nullable|exists:categories,id',
            'installments'         => 'nullable|array',
            'installments.*.amount' => 'required|numeric|min:0',
            'installments.*.date'   => 'required|date',
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
        if (!empty($data['installments'])) {
            foreach ($data['installments'] as $installment) {
                $num++;
                Transaction::create([
                    'user_id'        => $user->id,
                    'bill_id'        => $bill->id,
                    'name'           => 'P-'.$num.' '.$data['name'],
                    'date'           => $installment['date'],
                    'type'           => $data['type'] === 'recibida' ? 'income' : 'expense',
                    'total_amount'   => $installment['amount'],
                    'iva_percent'    => $data['iva_percent'] ?? 0,
                    'client'         => $data['client'] ?? null,
                    'description'    => $data['description'] ?? null,
                    'payment_method' => $data['payment_method'],
                    'category_id'    => $data['category_id'] ?? null,
                ]);
            }
        }else{
            Transaction::create([
                'user_id'        => $user->id,
                'bill_id'        => $bill->id,
                'name'           => $data['name'],
                'date'           => $data['date'],
                'type'           => $data['type'] === 'recibida' ? 'income' : 'expense',
                'total_amount'   => $data['total_amount'],
                'iva_percent'    => $data['iva_percent'] ?? 0,
                'client'         => $data['client'] ?? null,
                'description'    => $data['description'] ?? null,
                'payment_method' => $data['payment_method'],
                'category_id'    => $data['category_id'] ?? null,
            ]);
        }
        return response()->json($bill, 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $bill = Bill::find($id);
        
        if (!$bill) {
            return response()->json(['message' => 'Bill not found'], 404);
        }
        if ($user->id != $bill->user_id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'date'                  => 'required|date',
            'type'                  => 'required|in:recibida,emitida',
            'total_amount'          => 'required|numeric|min:0',
            'iva_percent'           => 'nullable|numeric|in:0,4,10,21',
            'client'                => 'nullable|string|max:255',
            'description'           => 'nullable|string',
            'payment_method'        => 'required|string',
            'plazos'                => 'nullable|integer|min:1',
            'category_id'           => 'nullable|exists:categories,id',
            'installments'          => 'nullable|array',
            'installments.*.amount' => 'required|numeric|min:0',
            'installments.*.date'   => 'required|date',
        ]);

        // Actualizar la bill
        $bill->update([
            'name'           => $data['name'],
            'date'           => $data['date'],
            'type'           => $data['type'],
            'total_amount'   => $data['total_amount'],
            'iva_percent'    => $data['iva_percent'] ?? 0,
            'client'         => $data['client'] ?? null,
            'description'    => $data['description'] ?? null,
            'payment_method' => $data['payment_method'],
            'plazos'         => $data['plazos'] ?? null,
            'category_id'    => $data['category_id'] ?? null,
        ]);

        // Borrar las transacciones antiguas vinculadas a esta bill
        Transaction::where('bill_id', $bill->id)->delete();

        // Crear las nuevas transacciones con los plazos actualizados
        if (!empty($data['installments'])) {
            $num = 0;
            foreach ($data['installments'] as $installment) {
                $num++;
                Transaction::create([
                    'user_id'        => $user->id,
                    'bill_id'        => $bill->id,
                    'name'           => 'P-'.$num.' '.$data['name'],
                    'date'           => $installment['date'],
                    'type'           => $data['type'] === 'recibida' ? 'income' : 'expense',
                    'total_amount'   => $installment['amount'],
                    'iva_percent'    => $data['iva_percent'] ?? 0,
                    'client'         => $data['client'] ?? null,
                    'description'    => $data['description'] ?? null,
                    'payment_method' => $data['payment_method'],
                    'category_id'    => $data['category_id'] ?? null,
                ]);
            }
        }else{
            Transaction::create([
                'user_id'        => $user->id,
                'bill_id'        => $bill->id,
                'name'           => $data['name'],
                'date'           => $data['date'],
                'type'           => $data['type'] === 'recibida' ? 'income' : 'expense',
                'total_amount'   => $data['total_amount'],
                'iva_percent'    => $data['iva_percent'] ?? 0,
                'client'         => $data['client'] ?? null,
                'description'    => $data['description'] ?? null,
                'payment_method' => $data['payment_method'],
                'category_id'    => $data['category_id'] ?? null,
            ]);
        }

        return response()->json($bill, 200);
    }

    public function delete($id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            return response()->json(['message' => 'Bill not found'], 404);
        }

        //Primero borro las transacciones asociadas a la bill
        Transaction::where('bill_id', $bill->id)->delete();
        //Despues borro la bill
        $bill->delete();
        

        return response()->json(['message' => 'Bill deleted successfully'], 200);
    }
}