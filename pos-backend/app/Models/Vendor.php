<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'contact_info', 'address', 'vendor_type', 'store_id',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function vendorItems()
    {
        return $this->hasMany(VendorItem::class);
    }
}
