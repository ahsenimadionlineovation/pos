<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Carbon\Carbon;
use DB;

class DashboardController extends Controller
{
    public function getDashboardStats(Request $request)
    {
        $storeId = $request->user()->store_id;

        // Total orders in the current month
        $totalOrders = Order::where('store_id', $storeId)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        // Total sales (sum of menu item prices multiplied by quantity) in the current month
        $totalSales = OrderItem::whereHas('order', function($query) use ($storeId) {
                $query->where('store_id', $storeId)
                    ->whereMonth('created_at', Carbon::now()->month);
            })
            ->join('menu_items', 'order_items.menuitem_id', '=', 'menu_items.id')
            ->select(DB::raw('SUM(menu_items.price * order_items.quantity) as total_sales'))
            ->first()
            ->total_sales;

        // Average order value in the current month
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        // Top-selling menu items in the current month
        $topItems = OrderItem::with('menuitem')
            ->whereHas('order', function($query) use ($storeId) {
                $query->where('store_id', $storeId)
                    ->whereMonth('created_at', Carbon::now()->month);
            })
            ->get()
            ->groupBy('menuitem_id')
            ->map(function ($itemGroup) {
                return [
                    'menu_item' => $itemGroup->first()->menuitem->name,
                    'quantity' => $itemGroup->sum('quantity'),
                ];
            })
            ->sortByDesc('quantity')
            ->take(5)
            ->values();

        // Return data in a JSON response
        return response()->json([
            'total_orders' => $totalOrders,
            'total_sales' => $totalSales,
            'average_order_value' => round($averageOrderValue, 2),
            'top_items' => $topItems,
        ]);
    }

    public function dashboard($storeId)
    {
        // Get the total sales for the current month
        $totalSales = OrderItem::whereHas('order', function($query) use ($storeId) {
                $query->where('store_id', $storeId)
                    ->whereMonth('created_at', Carbon::now()->month);
            })
            ->join('menu_items', 'order_items.menuitem_id', '=', 'menu_items.id')
            ->select(DB::raw('SUM(menu_items.price * order_items.quantity) as total_sales'))
            ->first()
            ->total_sales;

        // Count the total number of orders for the current month
        $totalOrders = Order::where('store_id', $storeId)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        return response()->json([
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders
        ]);
    }

    public function getMonthlySalesChart(Request $request)
    {
        $storeId = $request->user()->store_id; // Assuming each user belongs to a store

        // Sales data for the current year
        $currentYearSales = OrderItem::whereHas('order', function($query) use ($storeId) {
                $query->where('store_id', $storeId)
                    ->whereYear('created_at', Carbon::now()->year);
            })
            ->join('menu_items', 'order_items.menuitem_id', '=', 'menu_items.id')
            ->select(DB::raw('MONTH(order_items.created_at) as month'), DB::raw('COALESCE(SUM(menu_items.price * order_items.quantity), 0) as total_sales'))
            ->groupBy('month')
            ->pluck('total_sales', 'month');

        // Sales data for the previous year
        $previousYearSales = OrderItem::whereHas('order', function($query) use ($storeId) {
                $query->where('store_id', $storeId)
                    ->whereYear('created_at', Carbon::now()->subYear()->year);
            })
            ->join('menu_items', 'order_items.menuitem_id', '=', 'menu_items.id')
            ->select(DB::raw('MONTH(order_items.created_at) as month'), DB::raw('COALESCE(SUM(menu_items.price * order_items.quantity), 0) as total_sales'))
            ->groupBy('month')
            ->pluck('total_sales', 'month');

        // Initialize an array with 12 months for both current and previous year sales
        $months = [];
        for ($i = 1; $i <= 12; $i++) {
            $months[] = [
                'month' => Carbon::create()->month($i)->format('F'), // Full month name
                'current_year_sales' => $currentYearSales[$i] ?? 0,
                'previous_year_sales' => $previousYearSales[$i] ?? 0,
            ];
        }

        return response()->json($months);
    }

}
