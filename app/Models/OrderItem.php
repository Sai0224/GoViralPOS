<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Models\Product;

class OrderItem extends Model
{
    public function order() {
        return $this->belongsTo(Order::Class);
    }

    public function product() {
        return $this->hasOne(Product::class);
    }
}
