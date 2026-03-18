<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    // Fetch all employees directly from the database
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    // Save a new employee
    public function store(Request $request)
    {
        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->role,
            ]);

            return response()->json(['message' => 'Employee created', 'user' => $user], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create: ' . $e->getMessage()], 500);
        }
    }

    // Update an existing employee
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->name  = $request->name;
            $user->email = $request->email;
            $user->role  = $request->role;
            
            // Only update password if a new one was typed in
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();
            return response()->json(['message' => 'Employee updated'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update: ' . $e->getMessage()], 500);
        }
    }

    // Delete an employee
    public function destroy($id)
    {
        try {
            User::findOrFail($id)->delete();
            return response()->json(['message' => 'Employee deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete: ' . $e->getMessage()], 500);
        }
    }
}