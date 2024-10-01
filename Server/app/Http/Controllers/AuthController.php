<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    //
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',              // Minimum length of 8 characters
                'regex:/[a-z]/',      // Must contain at least one lowercase letter
                'regex:/[A-Z]/',      // Must contain at least one uppercase letter
                'regex:/[0-9]/',      // Must contain at least one digit
                'regex:/[@$!%*#?&]/', // Must contain a special character
            ],
            'confirm_password' => 'required|same:password',
            'name' => 'required|string|max:40',
            'phone' => 'required|digits:10',
        ]);

        if ($validator->fails()) {
            return Response::json([
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->password = Hash::make($request->password);
        $user->role_id = 2; // Customer
        $user->date_created = now()->toDateString();
        $user->save();

        $success['token'] =  $user->createToken('User Created')->plainTextToken;
        $success['id'] =  $user->id;

        return Response::json([
            'message' => 'User Created',
            'user' => $user,
            'token' => $success['token'],
            'id' => $success['id']
        ], 201);
    }

    public function login(Request $request)
    {
        $credetials = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (Auth::attempt($credetials)) {
            $user = Auth::user();
            $user = User::find($user->id);
            if ($user->is_deleted === 1) {
                return Response::json(["message" => "Account Has Been Deleted On" . $user->date_deleted], 401);
            }
            $previous_tokens = PersonalAccessToken::where('tokenable_id', $user->id)->get();
            foreach ($previous_tokens as $previous_token) {
                $previous_token->delete();
            }
            $token =  $user->createToken('User Logged In')->plainTextToken;
            return Response::json(["token" => $token, "user_id" => $user->id], 200);
        }
        return Response::json(["message" => "Wrong Credentials"], 401);
    }
}
