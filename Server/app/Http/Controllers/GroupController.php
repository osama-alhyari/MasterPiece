<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    public function addGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'parent_id' => 'nullable|exists:groups,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'request' => $request], 422);
        }

        $group = new Group();
        $group->name = $request->name;
        $group->description = $request->description;
        if ($request->filled('parent_id')) {
            $group->parent_id = $request->parent_id;
        }
        $group->save();

        return response()->json(["Success" => "Group Created Successfully", "Group" => $group]);
    }

    public function viewGroups()
    {
        $groups = Group::withCount('products')->with('group')->get();
        if ($groups->isEmpty()) {
            return response()->json(["Error" => "No Groups Exist"]);
        }
        return response()->json(["Groups" => $groups]);
    }

    public function viewGroup(string $id)
    {
        $group = Group::find($id);
        if (!$group) {
            return response()->json(["Error" => "Group Does Not Exist"]);
        }
        return response()->json(["Group" => $group]);
    }

    public function deleteGroup(string $id)
    {
        $group = Group::find($id);
        $group->delete();
        return response()->json(["Message" => "Group Deleted"]);
    }

    public function updateGroup(string $id, Request $request)
    {
        $group = Group::find($id);
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'parent_id' => 'nullable|exists:groups,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'request' => $request], 422);
        }
        $group->name = $request->name;
        $group->description = $request->description;
        if ($request->filled('parent_id')) {
            $group->parent_id = $request->parent_id;
        }
        $group->save();
        return response()->json(["Success" => "Group Updated Successfully", "Group" => $group]);
    }
}
