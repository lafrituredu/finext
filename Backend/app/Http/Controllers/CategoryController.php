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
        if ($user->rol != 'gestor') {
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
            'color' => 'string',
            'user_id' => 'exists:users,id'
        ]);

        $category = Category::create([
            'name' => $data['name'],
            'color' => $data['color'],
            'user_id' => $user->id
        ]);
        return response()->json($category, 201);
    }

    public function update(Request $request,$id){

        $user = $request->user();
        $category = Category::findOrFail($id);

        if ($user->id != $category->user_id) {
            return response('Unauthorized',401);
        }

        $data = $request->validate([
            'name' => 'required|string',
            'color' => 'string',
            'user_id' => 'exists:users,id'
        ]);

        $category->update([
            'name' => $data['name'],
            'color' => $data['color']
        ]);
    }

    public function destroy(Request $request, int $id){
        $user = $request->user();
        $category = Category::findOrFail($id);
        if ($user->id === $category->user_id) {
            Category::destroy($id);
            return response()->json(['message' => 'Category removed'], 200);
        }
        return response()->json(['message' => 'Unauthorized to remove this category'], 401);
    }

}
