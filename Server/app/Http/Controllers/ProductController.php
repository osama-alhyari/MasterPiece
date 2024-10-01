<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Image;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    //-----------------------------------Add Product---------------------------------------------------//
    public function addProduct(Request $request) // refactor so images dont get uploaded
    {                                            // to server when error happens.
        // Add request validation
        $this->validateProduct($request);

        DB::beginTransaction();
        try {
            // Save the product
            $product = $this->createProduct($request);

            // Attach categories to product
            $product->groups()->attach($request->categories);

            // Handle variants and images
            $this->handleVariantsAndImages($request, $product);

            DB::commit();
            return response()->json(["success" => "Product added successfully"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["error" => "Something went wrong"]);
        }
    }

    private function validateProduct(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'product_cover' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'categories' => 'required|array',

            // SKU validation
            'skus' => 'required|array',
            'skus.*' => 'required|string|distinct', // Ensure each SKU is unique

            // Stocks validation
            'stocks' => 'required|array',
            'stocks.*' => 'required|numeric|min:0',

            // Variant names validation
            'variant_names' => 'required|array',
            'variant_names.*' => 'required|string|max:255',

            // Images arrays validation
            'images_arrays' => 'required|array',
            'images_arrays.*.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',

            // Variant cover image index validation
            'variant_cover_image_indexes' => 'required|array',
            'variant_cover_image_indexes.*' => 'required|numeric|min:0',
        ]);
    }

    private function createProduct(Request $request)
    {
        // Create and save the product
        $product = new Product();
        $product->name = $request->product_name;
        $product->description = $request->description;
        $product->price = $request->price;
        $product_cover = time() . 'cover' . "." . $request->product_cover->extension();
        $product->image = $product_cover;
        $product->save();

        // Move the product cover image to the appropriate directory
        $request->product_cover->move(public_path('product_images'), $product_cover);

        return $product;
    }

    private function handleVariantsAndImages(Request $request, Product $product)
    {
        $num_of_variants = $request->number_of_variants;
        $skus = $request->skus;
        $stocks = $request->stocks;
        $variant_names = $request->variant_names;
        $images_files_arrays = $request->images_arrays;
        $variant_cover_image_indexes = $request->variant_cover_image_indexes;

        for ($i = 0; $i < $num_of_variants; $i++) {
            // Create and save the variant
            $variant = $this->createVariant($product->id, $skus[$i], $stocks[$i], $variant_names[$i]);

            // Process images for the variant
            $this->processVariantImages($images_files_arrays[$i], $variant, $variant_cover_image_indexes[$i], $i);
        }
    }

    private function createVariant($product_id, $sku, $stock, $name)
    {
        $variant = new Variant();
        $variant->product_id = $product_id;
        $variant->sku = $sku;
        $variant->stock = $stock;
        $variant->name = $name;
        $variant->save();

        return $variant;
    }

    private function processVariantImages($variant_images_files, Variant $variant, $cover_image_index, $variant_index)
    {
        foreach ($variant_images_files as $j => $image_file) {
            $image_name = $j . $variant_index . time() . "." . $image_file->extension();
            // Save the image in the database
            $img = new Image();
            $img->variant_id = $variant->id;
            $img->name = $image_name;
            $img->is_variant_cover = ($cover_image_index == $j) ? 1 : 0;
            $img->save();

            // Move the image file to the appropriate directory
            $image_file->move(public_path('product_images'), $image_name);
        }
        //------------------------------End Add Product------------------------------------------//


    }
    public function viewProduct(string $id)
    {
        $product = Product::with(['variants.images'])->find($id);
        return response()->json(["Product" => $product]);
    }
}
