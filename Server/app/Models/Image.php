<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['variant_id', 'name', 'is_variant_cover', 'is_product_cover'];

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}
