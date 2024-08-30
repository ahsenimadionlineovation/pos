<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'address',
        'created_by',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
