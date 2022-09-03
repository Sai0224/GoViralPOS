<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Transaction extends Model
{
    public function order() {
        return $this->belongsTo(Order::Class);
    }
}
