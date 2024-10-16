<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function getAllProducts()
    {
        $products = Product::with(['variants.images', 'groups'])->where('is_deleted', 0)->get();
        if ($products->isEmpty()) {
            return response()->json(["Error" => "No Products Exist"]);
        }
        return response()->json(["Products" => $products]);
    }

    public function getAvailableProducts()
    {
        $products = Product::with(['variants.images', 'groups'])->where('is_available', 1)->get();
        if ($products->isEmpty()) {
            return response()->json(["Error" => "No Products Available"]);
        }
        return response()->json(["Products" => $products]);
    }

    public function addProduct(Request $request)
    {
        // Add request validation
        $this->validateProduct($request);
        $product = $this->createProduct($request);
        // Attach categories to product
        if ($request->filled('groups')) {
            $product->groups()->attach($request->groups);
        }

        return response()->json(["success" => "Product added successfully", "product_id" => $product->id]);
    }

    private function validateProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'groups' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    }

    private function createProduct(Request $request)
    {
        // Create and save the product
        $product = new Product();
        $product->name = $request->name;
        $product->description = $request->description;
        $product->price = $request->price;
        $product_cover = $request->name . "." . $request->image->extension();
        $product->image = $product_cover;
        $product->save();
        // Move the product cover image to the appropriate directory
        $request->image->move(public_path('product_images'), $product_cover);

        return $product;
    }

    public function viewAnyProduct(string $id)
    {
        $product = Product::with(['variants.images', 'groups'])->where('is_deleted', 0)->find($id);
        if ($product === null) {
            return response()->json(["Error" => "Product Doesnt Exist"]);
        }
        return response()->json(["Product" => $product]);
    }

    public function viewProductIfAvailable(string $id)
    {
        $product = Product::where('is_available', 1)->with(['variants.images'])->find($id);
        if ($product === null) {
            return response()->json(["Error" => "Product Doesnt Exist"]);
        }
        return response()->json(["Product" => $product]);
    }

    public function updateProduct(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'groups' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'request' => $request], 422);
        }

        $product = Product::find($id);
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;
        if ($request->hasFile('image')) {
            File::delete(public_path('/product_images/' . $product->image));
            $product_cover = $request->name . "." . $request->image->extension();
            $request->image->move(public_path('product_images'), $product_cover);
            $product->image = $product_cover;
        }
        $product->groups()->sync($request->groups);
        $product->save();
        return response()->json(["Message" => $product]);
    }

    public function deleteProduct(string $id)
    {
        $product = Product::find($id);
        $product->is_deleted = 1;
        $product->is_available = 0;
        $product->save();
        return response()->json(["Message" => "Product Deleted"]);
    }

    public function hideProduct(string $id)
    {
        $product = Product::find($id);
        $product->is_available = 0;
        $product->save();
        return response()->json(["Message" => "Product Made Unavailable"]);
    }

    public function showProduct(string $id)
    {
        $product = Product::find($id);
        $product->is_available = 1;
        $product->save();
        return response()->json(["Message" => "Product Made Available"]);
    }
}
