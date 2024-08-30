<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'branch_id',
        'name',
        'description',
        'price',
        'stock',
        'category',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function decreaseStock($quantity)
    {
        $this->stock = max(0, $this->stock - $quantity);
        $this->save();
    }
}
