<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index($storeId)
    {
        $vendors = Vendor::with('vendorItems')->where('store_id', $storeId)->get();
        return response()->json($vendors);
    }

    public function show($id)
    {
        $vendor = Vendor::with('vendorItems')->findOrFail($id);
        return response()->json($vendor);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'contact_info' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'vendor_type' => 'nullable|string|max:255',
            'store_id' => 'required|exists:stores,id',
        ]);

        $vendor = Vendor::create($validatedData);

        return response()->json($vendor, 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'contact_info' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'vendor_type' => 'nullable|string|max:255',
            'store_id' => 'required|exists:stores,id',
        ]);

        $vendor = Vendor::findOrFail($id);
        $vendor->update($validatedData);

        return response()->json($vendor);
    }

    public function destroy($id)
    {
        $vendor = Vendor::findOrFail($id);
        $vendor->delete();

        return response()->json(null, 204);
    }
}
