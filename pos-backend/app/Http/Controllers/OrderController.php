<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $request->query('store_id');
        $branchId = $request->query('branch_id');

        $orders = Order::with(['store', 'branch', 'table', 'user', 'items.menuItem'])
            ->when($storeId, function ($query) use ($storeId) {
                return $query->where('store_id', $storeId);
            })
            ->when($branchId, function ($query) use ($branchId) {
                return $query->where('branch_id', $branchId);
            })
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function create()
    {
        // Logic for showing a form if necessary
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'branch_id' => 'required|exists:branches,id',
            'table_id' => 'required|exists:tables,id',
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'items.*.menuitem_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'store_id' => $validatedData['store_id'],
                'branch_id' => $validatedData['branch_id'],
                'table_id' => $validatedData['table_id'],
                'user_id' => $validatedData['user_id'],
                'status' => 'preparing',
            ]);

            foreach ($validatedData['items'] as $item) {
                $menuItem = MenuItem::find($item['menuitem_id']);

                if ($menuItem->stock < $item['quantity']) {
                    throw new \Exception('Not enough stock for menu item: ' . $menuItem->name);
                }

                // Subtract stock
                $menuItem->decrement('stock', $item['quantity']);

                // Create order items
                OrderItem::create([
                    'order_id' => $order->id,
                    'menuitem_id' => $item['menuitem_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        $order = Order::with(['store', 'branch', 'table', 'user', 'items.menuItem'])->findOrFail($id);

        return response()->json(['order' => $order]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|in:preparing,done,cancel',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validatedData['status']]);

        return response()->json(['message' => 'Order updated successfully', 'order' => $order]);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        DB::beginTransaction();

        try {
            foreach ($order->items as $item) {
                $menuItem = $item->menuItem;
                $menuItem->increment('stock', $item->quantity);
                $item->delete();
            }

            $order->delete();

            DB::commit();

            return response()->json(['message' => 'Order deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
