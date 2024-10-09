<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    //
    public function createOrder(Request $request)
    {
        $user = $request->user();


        try {
            // Retrieve the user's cart
            $cart = Cart::where('user_id', $user->id)->first();

            // Check if the cart exists and has items
            $cartItems = DB::table('carts_variants')->where('cart_id', $cart->id)->get();
            if ($cartItems->isEmpty()) {
                return response()->json(['error' => 'Cart is empty'], 400);
            }

            // Create a new order
            $order = new Order();
            $order->user_id = $user->id;
            $order->order_date = now();
            $order->items = $cart->items;
            $order->total = $cart->total;
            $order->status = 'Pending';
            $order->save();
            // Insert each cart item into the orders_variants table
            foreach ($cartItems as $cartItem) {
                DB::table('orders_variants')->insert([
                    'order_id' => $order->id,
                    'variant_id' => $cartItem->variant_id,
                    'quantity' => $cartItem->quantity,
                ]);
            }
            // return "alooo";
            // Clear the cart's items
            DB::table('carts_variants')->where('cart_id', $cart->id)->delete();

            // Reset cart totals
            $cart->items = 0;
            $cart->total = 0;
            $cart->save();
            // return $cart;
            // Commit the transaction if everything is successful
            DB::commit();

            return response()->json(['success' => 'Order created successfully!', 'order_id' => $order->id], 200);
        } catch (\Exception $e) {
            //     // Rollback the transaction if something goes wrong
            DB::rollBack();
            return response()->json(['error' => 'Something went wrong while creating the order. Please try again.'], 500);
        }
    }

    public function viewAllOrders()
    {
        $orders = Order::all();
        if (!$orders) {
            return response()->json(["Error" => "No Orders Exist"]);
        }
        return response()->json(["Orders" => $orders]);
    }

    public function viewOrder(string $id)
    {
        $order = Order::with(['variants.product'])->find($id);
        if (!$order) {
            return response()->json(["Error" => "Order Does Not Exist"]);
        }
        return response()->json(["Order" => $order]);
    }

    public function viewOrdersOfUser(string $id)
    {
        $orders = Order::where('user_id', $id)->get();
        if (!$orders) {
            return response()->json(["Error" => "User Did Not Make Any Orders"]);
        }
        return response()->json(["Orders" => $orders]);
    }

    public function changeOrderStatus(Request $request, string $id)
    {
        $order = Order::find($id);
        $order->status = $request->status;
        $order->save();
        return response()->json(["Message" => "Order Status Changed Successfully", "Order" => $order]);
    }

    public function deleteOrder(string $id)
    {
        $order = Order::find($id);
        $order->delete();
        return response()->json(["Message" => "Order Deleted Successfully"]);
    }

}
