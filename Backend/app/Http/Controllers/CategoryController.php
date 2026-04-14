<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index()
    {
        $category = Category::with('user')->get();

        return response()->json($category);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'user_id' => 'exists:users,id'
        ]);

        $category = Category::create($data);
        return response()->json($category, 201);
    }

}
