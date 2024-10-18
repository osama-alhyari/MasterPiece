<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['name', 'description', 'parent_id'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'group_product');
    }
    public function group()
    {
        return $this->belongsTo(Group::class, 'parent_id');
    }
    public function children()
    {
        return $this->hasMany(Group::class, 'parent_id');
    }
}
