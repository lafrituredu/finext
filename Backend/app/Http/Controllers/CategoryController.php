<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index()
    {
        $transactions = Category::with(['category' , 'user'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($transactions);
    }

}
