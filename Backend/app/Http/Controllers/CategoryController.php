<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->rol == 'autonomo') {
            $category = Category::where('user_id', $user->id)->orWhereNull('user_id')->orderBy('user_id', 'desc')->get();
        }else{
            $category = Category::with('user')->get();
        }

        return response()->json($category);
    }

    public function store(Request $request) {

        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string',
            'user_id' => 'exists:users,id'
        ]);

        $category = Category::create([
            'name' => $data['name'],
            'user_id' => $user->id
        ]);
        return response()->json($category, 201);
    }

    public function destroy($id){
        return Category::destroy($id);
    }

}
