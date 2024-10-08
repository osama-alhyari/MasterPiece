<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Image;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VariantController extends Controller
{
    //-----------------------------------Add Variant---------------------------------------------------//
    public function addVariant(Request $request)
    {
        // Validate the request
        $this->validateVariant($request);

        DB::beginTransaction(); // Start the transaction

        try {
        // Find the product
        $product = Product::find($request->product_id);

        // Create a new variant
        $variant = new Variant();
        $variant->product_id = $request->product_id;
        $variant->stock = $request->stock;
        $variant->name = $request->name;
        $variant->sku = $request->sku;
        $variant->save();

        // Process the images
        $images = $request->images;
        $cover_index = $request->cover_index;

            foreach ($images as $index => $imageFile) {
            $image = new Image();
            $image->variant_id = $variant->id;

            if ($index == $cover_index) {
                    $image_name = $product->name . '-' . $request->name . '-' . $index . '-' . 'cover' . "." . $imageFile->extension();
                $image->is_variant_cover = 1;
            } else {
                    $image_name = $product->name . '-' . $request->name . '-' . $index . "." . $imageFile->extension();
                $image->is_variant_cover = 0;
            }

            $image->name = $image_name;
            $image->save();

                // Move the image file to the appropriate folder
                $imageFile->move(public_path('product_images'), $image_name);
            }

            DB::commit(); // Commit the transaction if everything is successful
            return response()->json(["Variant" => $variant]);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction if something goes wrong
            return response()->json(["error" => $e], 500);
        }
    }

    private function validateVariant(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'stock' => 'required|numeric|min:0',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|distinct|max:255',
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cover_index' => 'required|numeric|min:0|max:' . (count($request->images) - 1),
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'request' => $request], 422);
        }
    }

    public function deleteImage(string $id)
    {
        $image = Image::find($id);
        File::delete(app_path() . '/product_images/' . $image->name);
        $image->delete();
        return response()->json(["Message" => "Image Deleted"]);
    }

    public function deleteVariant(string $id)
    {
        Variant::find($id)->delete();
        return response()->json(["Message" => "Variant Deleted"]);
    }

    public function setVariantStock(string $id, Request $request)
    {
        $variant = Variant::find($id);
        $variant->stock = $request->stock;
        $variant->save();
        return response()->json(["Message" => "Variant Stock Updates"]);
    }

    public function increaseStock(string $id, Request $request)
    {
        $variant = Variant::find($id);
        $variant->stock += $request->quantity;
        $variant->save();
        return response()->json(["Message" => "Variant Stock Updates"]);
    }

    public function decreaseStock(string $id, Request $request)
    {
        $variant = Variant::find($id);
        $variant->stock -= $request->quantity;
        $variant->save();
        return response()->json(["Message" => "Variant Stock Updates"]);
    }

    public function viewVariant(string $id)
    {
        return response()->json(["Variant" => Variant::with('images')->find($id)]);
    }

    public function viewAllVariants(string $id)
    {
        return response()->json(["Variants" => Variant::where('product_id', $id)->with('images')->get()]);
    }

    public function updateVariant(string $id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'stock' => 'required|numeric|min:0',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|distinct|max:255',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cover_id' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'request' => $request], 422);
        }

        DB::beginTransaction(); // Start transaction

        try {
            $variant = Variant::find($id);
            $variant->stock = $request->stock;
            $variant->name = $request->name;
            $variant->sku = $request->sku;
            $variant->save();

            $old_cover = Image::where('variant_id', $id)->where('is_variant_cover', 1)->first();
            if ($old_cover->id != $request->cover_id) {
                $old_cover->is_variant_cover = 0;
                $old_cover->save();
                $new_cover = Image::find($request->cover_id);
                $new_cover->is_variant_cover = 1;
                $new_cover->save();
            }

            // If images are uploaded, process and save them
            if ($request->has('images') && is_array($request->images) && count($request->images) > 0) {
            foreach ($request->images as $index => $imageFile) {
                $image = new Image();
                $image->variant_id = $id;
                $image_name = $variant->product->name . '-' . $request->name . '-' . $index . time() . "." . $imageFile->extension();
                $image->name = $image_name;
                $image->save();

                // Move the image file to the appropriate folder
                $imageFile->move(public_path('product_images'), $image_name);
            }
        }

            DB::commit(); // Commit the transaction if everything is successful
            return response()->json(["Variant" => Variant::with('images')->find($id)]);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction if something goes wrong
            return response()->json(["error" => $e], 500);
        }
    }
}
