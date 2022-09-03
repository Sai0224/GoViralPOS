<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Transaction;
use App\Models\OrderItem;

class Order extends Model
{
    protected $fillable = ['reference_no', 'tax', 'service_charge', 'total_amount_cents', 'is_walkin', 'status'];

    public function transaction() {
        return $this->hasOne(Transaction::class);
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }
}
