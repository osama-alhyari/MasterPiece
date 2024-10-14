<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'price'
    ];

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_product');
    }

    public function variants()
    {
        return $this->hasMany(Variant::class);
    }
}
