<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Image;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    //-----------------------------------Add Variant---------------------------------------------------//
    public function addVariant(Request $request)
    {
        $this->validateVariant($request);
        $product = Product::find($request->product_id);
        $variant = new Variant();
        $variant->product_id = $request->product_id;
        $variant->stock = $request->stock;
        $variant->name = $request->name;
        $variant->sku = $request->sku;
        $variant->save();
        $images = $request->images;
        $cover_index = $request->cover_index;
        foreach ($images as $index => $image) {
            $image = new Image();
            $image->variant_id = $variant->id;
            if ($index == $cover_index) {
                $image_name = $product->name . '-' . $request->name . '-' . $index . '-' . 'cover' . "." . $request->image->extension();
                $image->is_variant_cover = 1;
            } else {
                $image_name = $product->name . '-' . $request->name . '-' . $index . "." . $request->image->extension();
                $image->is_variant_cover = 0;
            }
            $image->name = $image_name;
            $image->save();
            $request->images[$index]->move(public_path('product_images'), $image_name);
        }
    }

    private function validateVariant(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'stock' => 'required|numeric|min:0',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|distinct|max:255',
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cover_index' => 'required|numeric|min:0|max:' . (count($request->images) - 1),
        ]);
    }
}
