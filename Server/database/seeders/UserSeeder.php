<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insert([
            "id" => 1,
            'name' => "Osama Admin",
            'email' => "admin@gmail.com",
            'password' => Hash::make("11111qQ!"),
            'phone' => "0777217056",
            "role_id" => 1,
            "date_created" => "1999-02-20"
        ]);

        DB::table('users')->insert([
            'id' => 2,
            'name' => "Osama Customer",
            'email' => "customer@gmail.com",
            'password' => Hash::make("11111qQ!"),
            'phone' => "0777217056",
            "role_id" => 2,
            "date_created" => "1999-02-20"
        ]);
    }
}
