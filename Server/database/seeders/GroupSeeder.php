<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insert([
            "id" => 1,
            'name' => "Group 1",
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus a nisi est rerum quaerat animi accusamus quos saepe fugiat ullam, expedita sed, commodi doloremque autem quis dolores at consequatur accusantium!',
        ]);
        DB::table('users')->insert([
            "id" => 2,
            'name' => "Group 2",
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus a nisi est rerum quaerat animi accusamus quos saepe fugiat ullam, expedita sed, commodi doloremque autem quis dolores at consequatur accusantium!',
        ]);
        DB::table('users')->insert([
            "id" => 3,
            'name' => "Group 3",
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus a nisi est rerum quaerat animi accusamus quos saepe fugiat ullam, expedita sed, commodi doloremque autem quis dolores at consequatur accusantium!',
            'parent_id' => 2
        ]);
    }
}
