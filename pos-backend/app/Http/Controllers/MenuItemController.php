<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index($storeId)
    {
        $menuItems = MenuItem::where('store_id', $storeId)->get();
        return response()->json($menuItems);
    }
    
    public function branch($branchId)
    {
        $menuItems = MenuItem::where('branch_id', $branchId)->get();
        return response()->json($menuItems);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category' => 'nullable|string',
        ]);

        $menuItem = MenuItem::create($validatedData);
        return response()->json($menuItem, 201);
    }

    public function show($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        return response()->json($menuItem);
    }

    public function update(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);

        $validatedData = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category' => 'nullable|string',
        ]);

        $menuItem->update($validatedData);
        return response()->json($menuItem);
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->delete();
        return response()->json(null, 204);
    }
}
