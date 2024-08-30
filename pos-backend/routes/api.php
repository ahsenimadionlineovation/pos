<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/users/email/{email}', [AuthController::class, 'getUserByEmail'])->middleware('auth:sanctum');
Route::get('/users/store/{store_id}', [AuthController::class, 'getUserByStore_id'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function() {
    Route::apiResource('users', UserController::class);

    Route::get('/tables/store/{storeId}', [TableController::class, 'index']);
    Route::post('/tables', [TableController::class, 'store']);
    Route::get('/tables/{id}', [TableController::class, 'show']);
    Route::put('/tables/{id}', [TableController::class, 'update']);
    Route::delete('/tables/{id}', [TableController::class, 'destroy']);
    Route::get('tables/branch/{branch_id}', [TableController::class, 'getTablesByBranch']);

    Route::get('branches/store/{storeId}', [BranchController::class, 'index']);
    Route::post('branches', [BranchController::class, 'store']);
    Route::get('branches/{id}', [BranchController::class, 'show']);
    Route::put('branches/{id}', [BranchController::class, 'update']);
    Route::delete('branches/{id}', [BranchController::class, 'destroy']);

    Route::get('/menu-items/store/{storeId}', [MenuItemController::class, 'index']);
    Route::get('/menu-items/branch/{branchId}', [MenuItemController::class, 'branch']);
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);
    Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);
    Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);

    Route::get('orders/{store_id}', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::put('orders/{id}', [OrderController::class, 'update']);
    Route::delete('orders/{id}', [OrderController::class, 'destroy']);
});