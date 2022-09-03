<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\OrderItem;


class OrderController extends Controller
{
    public function store(Request $request) {
        //create new order
        $request['reference_no'] = "";
        $request['status'] = $request->is_walkin ? 'completed' : 'pending';
        $order = Order::create($request->except(['cartItem', 'paid_amount_cents', 'payment_method']));
        $order->reference_no = "O" . $order->id;
        $order->save();

        //create new transactions
        $transaction = new Transaction;
        $transaction->order_id = $order->id;
        $transaction->payment_method = $request->payment_method;
        $transaction->status = $order->is_walkin ? 'paid' : 'pending';
        $transaction->paid_amount_cents = $request->paid_amount_cents;
        $transaction->save();

        //create new order_items
        foreach($request->cartItem as $cartItem) {
            print_r($cartItem);
            $orderItem = new OrderItem;
            $orderItem->order_id = $order->id;
            $orderItem->cost_per_item = $cartItem['price_cents'];
            $orderItem->product_name = $cartItem['name'];
            $orderItem->quantity = $cartItem['quantity'];
            $orderItem->save();
        }
        
        return true;

    }
}
