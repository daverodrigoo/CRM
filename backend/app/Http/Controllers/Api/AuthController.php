<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            
            
            $user = Auth::user();
            
            
            $token = $user->createToken('CRM_Auth_Token')->plainTextToken;

            
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ], 200);
        }

        
        return response()->json([
            'message' => 'Invalid email or password.'
        ], 401);
    }

    // --- 1. Send the Reset Email ---
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Laravel automatically generates a secure token and formats an email
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent to your email!'], 200)
            : response()->json(['error' => 'Unable to send reset link. Check your email.'], 400);
    }

    // --- 2. Actually Reset the Password (We will use this in Half 2) ---
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed', // 'confirmed' means React must send password AND password_confirmation
        ]);

        $status = Password::reset($request->only('email', 'password', 'password_confirmation', 'token'), function ($user, $password) {
            $user->forceFill([
                'password' => \Illuminate\Support\Facades\Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();
            event(new PasswordReset($user));
        });

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Your password has been reset!'], 200)
            : response()->json(['error' => 'Invalid token or email.'], 400);
    }

    // --- 3. Change Password for Logged-In User ---
    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed', // Ensures 'password' and 'password_confirmation' match
        ]);

        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully!'], 200);
    }
}