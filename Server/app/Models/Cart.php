<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['user_id', 'total', 'items'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function variants()
    {
        return $this->belongsToMany(Variant::class)->withPivot('quantity');
    }
}
