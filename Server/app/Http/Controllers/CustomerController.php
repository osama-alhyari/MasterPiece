<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\User;


class CustomerController extends Controller
{
    //
    public function viewProfile(Request $request)
    {
        return Response::json(['user' => $request->user()], 200);
    }

    public function customerUpdatesProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => [
                'nullable',
                'string',
                'min:8',              // Minimum length of 8 characters
                'regex:/[a-z]/',      // Must contain at least one lowercase letter
                'regex:/[A-Z]/',      // Must contain at least one uppercase letter
                'regex:/[0-9]/',      // Must contain at least one digit
                'regex:/[@$!%*#?&]/', // Must contain a special character
            ],
            'name' => 'required|string|max:40',
            'phone' => 'required|digits:10',
        ]);

        if ($validator->fails()) {
            return Response::json([
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ], 422);
        }
        if ($request->password) {
            User::find($request->user()->id)->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'password' => Hash::make($request->password)
            ]);
        } else {
            User::find($request->user()->id)->update([
                'name' => $request->name,
                'phone' => $request->phone
            ]);
        }

        return Response::json(['message' => "User Updated", 'user' => $request->user()], 200);
    }

    public function customerDeletesProfile(Request $request)
    {
        User::find($request->user()->id)->update([
            'is_deleted' => 1,
            'date_deleted' => now()->toDateString()
        ]);

        return Response::json(["message" => "Profile Has Been Deleted"], 200);
    }
}
