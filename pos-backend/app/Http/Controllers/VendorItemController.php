<?php

namespace App\Http\Controllers;

use App\Models\VendorItem;
use Illuminate\Http\Request;

class VendorItemController extends Controller
{
    public function index()
    {
        $vendorItems = VendorItem::with('vendor')->get();
        return response()->json($vendorItems);
    }

    public function show($id)
    {
        $vendorItem = VendorItem::with('vendor')->findOrFail($id);
        return response()->json($vendorItem);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'vendor_id' => 'required|exists:vendors,id',
        ]);

        $vendorItem = VendorItem::create($validatedData);

        return response()->json($vendorItem, 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'vendor_id' => 'required|exists:vendors,id',
        ]);

        $vendorItem = VendorItem::findOrFail($id);
        $vendorItem->update($validatedData);

        return response()->json($vendorItem);
    }

    public function destroy($id)
    {
        $vendorItem = VendorItem::findOrFail($id);
        $vendorItem->delete();

        return response()->json(null, 204);
    }
}