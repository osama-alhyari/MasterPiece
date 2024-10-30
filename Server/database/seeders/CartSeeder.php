<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('carts')->insert([
            "user_id" => 1,
            'total' => 0,
            'items' => 0,
        ]);

        DB::table('carts')->insert([
            "user_id" => 2,
            'total' => 0,
            'items' => 0,
        ]);
    }
}
