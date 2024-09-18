<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) {
    // Validate input data
    $data = $request->validate([
        'storename' => ['required', 'string'],
        'name' => ['required', 'string'],
        'phone' => ['required', 'string'],
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required', 'min:6', 'confirmed'],
        'role' => ['required', 'string'],
    ]);

    // Hash the password before storing it
    $data['password'] = Hash::make($data['password']);

    // Create a store first
    $store = Store::create([
        'store_name' => $data['storename'],
        'user_id' => null, // User ID will be updated after creating the user
    ]);

    // Create the user and associate with the store
    $user = User::create(array_merge($data, ['store_id' => $store->id]));

    // Link the store to the user
    $store->user_id = $user->id;
    $store->save();

    // Create a new token for the user
    $token = $user->createToken('auth_token')->plainTextToken;

    // Return the user data and token
    return response([
        'user' => $user,
        'store' => $store,
        'token' => $token
    ], 201);
}


    public function login(Request $request) {
        // Validate input data
        $data = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'min:6'],
        ]);

        // Retrieve the user by email
        $user = User::where('email', $data['email'])->first();

        // Check if the password is correct
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        // Create a new token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the user data and token
        return response([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request) {
        // Revoke the user's current token
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        }

        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    public function getUserByEmail($email)
    {
        $user = User::where('email', $email)->with('store')->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'user' => $user,
        ], 200);
    }

    public function getUserByStore_id($store_id) {
        $users = User::where('store_id', $store_id)->get();
        return response()->json([
            'users' => $users,
        ], 200);
    }

    public function getStorebyid($store_id) {
        $store = Store::where('id', $store_id)->first(); 
        return response()->json([
            'store' => $store,
        ], 200);
    }
}
