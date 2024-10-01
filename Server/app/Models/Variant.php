<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['sku', 'stock', 'product_id', 'name'];

    public function images()
    {
        return $this->hasMany(Image::class);
    }
    public function orders()
    {
        return $this->belongsToMany(Order::class)->withPivot('quantity');
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
