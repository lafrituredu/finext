<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Goal;

class GoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $goals = Goal::where('user_id',$user->id)->get();
        return response()->json($goals,200);
    }

    public function addContribution(Request $request, int $id){
        $user = $request->user();
        $goal = Goal::find($id);
        if ($goal->user_id != $user->id) {
            return 401;
        }
        $data = $request->validate([
            'contribution' => 'required|numeric'
        ]);

        $new_amount = $goal->current_amount + $data['contribution'];
        return $goal->update([
            'current_amount' => $new_amount;
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'required|string',
            'target_amount' => 'required|numeric',
            'current_amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'completed' => 'required|numeric'
        ]);

        $goal = Goal::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'target_amount' => $data['target_amount'],
            'current_amount' => $data['current_amount'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'completed' => $data['completed']
        ]);

        return response()->json($goal, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $goal = Goal::find($id);

        $goal->validate([
            'name' => 'required|string',
            'target_amount' => 'required|numeric',
            'current_amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'completed' => 'required|numeric'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return Goal::destroy($id);
    }
}
