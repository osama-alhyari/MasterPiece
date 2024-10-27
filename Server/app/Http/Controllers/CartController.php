<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function addItem(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $variant = Variant::find($id);
            $user_id = $request->user()->id;
            $cart = Cart::where('user_id', $user_id)->first();
            $cart->total = $cart->total + ($variant->product->price * $request->quantity);
            $cart->items = $cart->items + $request->quantity;
            $cart->save();

            // Check if the variant is already in the cart
            $cartVariant = DB::table('cart_variant')
                ->where('cart_id', $cart->id)
                ->where('variant_id', $id)
                ->first();

            if ($cartVariant) {
                // If the variant is already in the cart, increment the quantity
                DB::table('cart_variant')
                    ->where('cart_id', $cart->id)
                    ->where('variant_id', $id)
                    ->increment('quantity', $request->quantity);
            } else {
                // If the variant is not in the cart, attach it with quantity
                DB::table('cart_variant')->insert([
                    'cart_id' => $cart->id,
                    'variant_id' => $id,
                    'quantity' => $request->quantity
                ]);
            }

            DB::commit();
            return response()->json(["Message" => "Item Added To Cart"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["Message" => "Failed to Add Item to Cart", "Error" => $e->getMessage()], 500);
        }
    }

    public function decrementItem(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $variant = Variant::find($id);
            $user_id = $request->user()->id;
            $cart = Cart::where('user_id', $user_id)->first();
            $cart->total = $cart->total - $variant->product->price;
            $cart->items = $cart->items - 1;
            $cart->save();

            // If the variant is already in the cart, decrement the quantity by 1
            $oldCartItem = DB::table('cart_variant')
                ->where('cart_id', $cart->id)
                ->where('variant_id', $id)->first();

            if ($oldCartItem->quantity == 1) {
                DB::table('cart_variant')
                    ->where('cart_id', $cart->id)
                    ->where('variant_id', $id)->delete();
            } else {
                DB::table('cart_variant')
                    ->where('cart_id', $cart->id)
                    ->where('variant_id', $id)
                    ->decrement('quantity', 1);
            }

            DB::commit();
            return response()->json(["Message" => "Cart Item Decremented"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["Message" => "Failed to Decrement Item", "Error" => $e->getMessage()], 500);
        }
    }

    public function incrementItem(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $variant = Variant::find($id);
            $user_id = $request->user()->id;
            $cart = Cart::where('user_id', $user_id)->first();
            $cart->total = $cart->total + $variant->product->price;
            $cart->items = $cart->items + 1;
            $cart->save();

            $cartVariant = DB::table('cart_variant')
                ->where('cart_id', $cart->id)
                ->where('variant_id', $id)
                ->first();

            if ($cartVariant) {
                // If the variant is already in the cart, increment the quantity
                DB::table('cart_variant')
                    ->where('cart_id', $cart->id)
                    ->where('variant_id', $id)
                    ->increment('quantity', 1);
            } else {
                // If the variant is not in the cart, attach it with quantity
                DB::table('cart_variant')->insert([
                    'cart_id' => $cart->id,
                    'variant_id' => $id,
                    'quantity' => 1
                ]);
            }

            DB::commit();
            return response()->json(["Message" => "Cart Item Incremented"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["Message" => "Failed to Increment Item", "Error" => $e->getMessage()], 500);
        }
    }

    public function removeItem(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $variant = Variant::find($id);
            $user_id = $request->user()->id;
            $cart = Cart::where('user_id', $user_id)->first();
            $quantity = DB::table('cart_variant')
                ->where('cart_id', $cart->id)
                ->where('variant_id', $id)
                ->first()->quantity;
            $cart->total = $cart->total - ($variant->product->price * $quantity);
            $cart->items = $cart->items - $quantity;
            $cart->save();

            DB::table('cart_variant')
                ->where('cart_id', $cart->id)
                ->where('variant_id', $id)
                ->delete();

            DB::commit();
            return response()->json(["Message" => "Cart Item Removed"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["Message" => "Failed to Delete Item", "Error" => $e->getMessage()], 500);
        }
    }

    public function clearCart(Request $request)
    {
        $user_id = $request->user()->id;
        DB::beginTransaction();
        try {
            $cart = Cart::find($user_id);
            $cart->items = 0;
            $cart->total = 0;
            $cart->save();
            DB::table('cart_variant')
                ->where('cart_id', $cart->id)
                ->delete();
            DB::commit();
            return response()->json(["Message" => "Cart Cleared"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["Message" => "Failed to Clear Cart", "Error" => $e->getMessage()], 500);
        }
    }

    public function viewCart(Request $request)
    {
        $user_id = $request->user()->id;
        $cart = Cart::with('variants.product', 'variants.images')->find($user_id);
        return response()->json(["Cart" => $cart]);
    }
}
