<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\Slider;


class SliderController extends Controller
{
    //
    public function createSlider(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'nullable',
            'grou_id' => 'nullable',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:4096',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $slider = new Slider();
        if ($request->has('product_id')) {
            $slider->product_id = $request->product_id;
        }
        if ($request->has('group_id')) {
            $slider->group_id = $request->group_id;
        }
        $slider_image = time() . "." . $request->image->extension();
        $slider->image = $slider_image;
        $slider->save();
        // Move the product cover image to the appropriate directory
        $request->image->move(public_path('slider_images'), $slider_image);
        return response()->json(["Message" => "Slider Added Successfully"]);
    }

    public function index()
    {
        $sliders = Slider::all();
        return response()->json(["Sliders" => $sliders]);
    }

    // Get a single slider by id
    public function show($id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json(["Message" => "Slider not found"], 404);
        }

        return response()->json(["Slider" => $slider]);
    }

    // Update an existing slider
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'nullable',
            'group_id' => 'nullable',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:4096',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json(["Message" => "Slider not found"], 404);
        }

        if ($request->has('product_id')) {
            $slider->product_id = $request->product_id;
        }

        if ($request->has('group_id')) {
            $slider->group_id = $request->group_id;
        }

        if ($request->hasFile('image')) {
            // Delete the old image file if exists
            if ($slider->image && file_exists(public_path('slider_images/' . $slider->image))) {
                unlink(public_path('slider_images/' . $slider->image));
            }

            // Update the image
            $slider_image = time() . "." . $request->image->extension();
            $slider->image = $slider_image;
            $request->image->move(public_path('slider_images'), $slider_image);
        }

        $slider->save();

        return response()->json(["Message" => "Slider updated successfully"]);
    }

    // Delete a slider
    public function destroy(string $id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json(["Message" => "Slider not found"], 404);
        }

        // Delete the image file if exists
        if ($slider->image && file_exists(public_path('slider_images/' . $slider->image))) {
            unlink(public_path('slider_images/' . $slider->image));
        }

        $slider->delete();

        return response()->json(["Message" => "Slider deleted successfully"]);
    }
}
