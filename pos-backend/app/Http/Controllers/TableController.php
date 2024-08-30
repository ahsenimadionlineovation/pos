<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index($storeId)
    {
        $tables = Table::with('store', 'branch', 'creator')->where('store_id', $storeId)->get();
        return response()->json(['tables' => $tables], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'branch_id' => 'required|exists:branches,id',
            'table_number' => 'required|string|max:255',
            'seats' => 'required|integer',
            'created_by' => 'required|exists:users,id',
        ]);

        $table = Table::create($request->all());

        return response()->json(['table' => $table, 'message' => 'Table created successfully'], 201);
    }

    public function show($id)
    {
        $table = Table::with('store', 'branch', 'creator')->find($id);

        if (!$table) {
            return response()->json(['message' => 'Table not found'], 404);
        }

        return response()->json(['table' => $table], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'branch_id' => 'required|exists:branches,id',
            'table_number' => 'required|string|max:255',
            'seats' => 'required|integer',
            'created_by' => 'required|exists:users,id',
        ]);

        $table = Table::find($id);

        if (!$table) {
            return response()->json(['message' => 'Table not found'], 404);
        }

        $table->update($request->all());

        return response()->json(['table' => $table, 'message' => 'Table updated successfully'], 200);
    }

    public function destroy($id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json(['message' => 'Table not found'], 404);
        }

        $table->delete();

        return response()->json(['message' => 'Table deleted successfully'], 200);
    }

    public function getTablesByBranch($branch_id)
    {
        $tables = Table::where('branch_id', $branch_id)->get();
        return response()->json($tables);
    }
}
