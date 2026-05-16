<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmployeeMail;

class EmployeeController extends Controller
{
    
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    // Save a new employee
    public function store(Request $request)
    {
        try {
            // 1. Capture the raw password BEFORE it gets hashed so we can email it
            $plainPassword = $request->password;

            // Create the user in the database
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->role,
            ]);

            // 2. NEW LOGIC: Send the welcome email!
            try {
                Mail::to($user->email)->send(new WelcomeEmployeeMail($user, $plainPassword));
            } catch (\Exception $e) {
                // If the email fails (e.g. Mailtrap is down), log it, but don't delete the user
                \Log::error('Failed to send welcome email: ' . $e->getMessage());
            }

            return response()->json(['message' => 'Employee created and email sent successfully', 'user' => $user], 201);
            
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