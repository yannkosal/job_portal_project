<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserImage;
use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class GoogleLoginController extends Controller
{
    public function googleLogin(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'role' => 'required|in:user,recruiter,admin',
        ]);

        // Verify google token
        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($request->token);
        if (! $payload) {
            return response()->json(['error' => 'Invalid google token'], 401);
        }

        // Extract google info
        $email = $payload['email'];
        $googleId = $payload['sub'];
        $googleImage = $payload['picture'] ?? null;
        $targetRole = $request->role;

        // try to find google id or email
        $user = User::where('google_id', $googleId)->orWhere('email', $email)->first();

        if ($user) {
            // Security Check
            if ($user->role !== $targetRole) {
                return response()->json([
                    'error' => "This account is registered as a {$user->role}. Please use the correct login form.",
                ], 403);
            }
            // Update google id if it wasn't set yet
            if (! $user->google_id) {
                $user->update(['google_id' => $googleId]);
            }
        } else {
            // register new user if not found
            $nameParts = explode(' ', $payload['name'], 2);
            $user = User::create([
                'first_name' => $nameParts[0],
                'last_name' => $nameParts[1] ?? '',
                'email' => $email,
                'password' => bcrypt(Str::random(24)),
                'role' => $targetRole,
                'google_id' => $googleId,
                'is_active' => true,
            ]);
        }
        if (! $user->is_active) {
            return response()->json([
                'error' => 'Account is deactivated',
            ], 403);
        }
        // save images
        if ($googleImage) {
            $existingImage = UserImage::where('user_id', $user->id)->first();

            // Update if no image
            if (! $existingImage || str_starts_with($existingImage->image_path, 'http')) {
                UserImage::updateOrCreate(['user_id' => $user->id], ['image_path' => $googleImage]);
            }
        }
        // generate JWT
        $token = JWTAuth::fromUser($user);
        // get Cookie setting from config or helper
        $isProd = app()->environment('production');

        // Return http only
        return response()->json([
            'success' => 'Login Successful',
            'user' => [
                'full_name' => $user->full_name,
                'first_name' => $user->first_name,
                'role' => $user->role,
                'email' => $user->email,
                'image' => str_starts_with(optional($user->image)->image_path, 'http')
                    ? optional($user->image)->image_path
                    : ($user->image ? url('storage/'.$user->image->image_path) : null),
            ],
        ])->cookie(
            'auth_token',   // name
            $token,         // token
            60 * 25,        // 1 Day
            '/',            // path
            null,           // domain
            false,          // secure = false ofr localhost
            true,           // http-only
            false,
            'Lax'           // samesite Lax instead of strict
        );
    }
}
