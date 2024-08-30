<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index($storeId)
    {
        $branches = Branch::where('store_id', $storeId)->get();
        return response()->json(['branches' => $branches]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'created_by' => 'required|exists:users,id',
        ]);

        $branch = Branch::create($data);
        return response()->json(['branch' => $branch, 'message' => 'Branch created successfully']);
    }

    public function show($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }
        return response()->json(['branch' => $branch]);
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
        ]);

        $branch->update($data);
        return response()->json(['branch' => $branch, 'message' => 'Branch updated successfully']);
    }

    public function destroy($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }

        $branch->delete();
        return response()->json(['message' => 'Branch deleted successfully']);
    }
}
