<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate that the user actually sent an email and password
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Attempt to log in with those credentials
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            
            // 3. If successful, get the user details
            $user = Auth::user();
            
            // 4. Create a secure API token (using Laravel Sanctum)
            $token = $user->createToken('CRM_Auth_Token')->plainTextToken;

            // 5. Send the token and user info (including their role!) back to React
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ], 200);
        }

        // 6. If the email/password is wrong, reject them
        return response()->json([
            'message' => 'Invalid email or password.'
        ], 401);
    }
}