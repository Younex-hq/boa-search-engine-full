<?php

namespace Database\Seeders;

use App\Models\Direction;
use App\Models\Location;
use Illuminate\Database\Seeder;

class DirectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get locations / if needed
        // $alger = Location::where('name', 'Alger')->first();
        // $oran = Location::where('name', 'Oran')->first();
        // $anaba = Location::where('name', 'Anaba')->first();

        // Create parent directions
        $mainDirection = Direction::create([
            'name' => 'Global',
            // 'location_id' => $alger->id,
            'parent_direction_id' => null,
        ]);

        // // Create child directions
        // Direction::create([
        //     'name' => 'IT Department',
        //     'location_id' => $alger->id,
        //     'parent_direction_id' => $mainDirection->id,
        // ]);

        // Direction::create([
        //     'name' => 'HR Department',
        //     'location_id' => $oran->id,
        //     'parent_direction_id' => $mainDirection->id,
        // ]);

        // Direction::create([
        //     'name' => 'Finance Department',
        //     'location_id' => $anaba->id,
        //     'parent_direction_id' => $mainDirection->id,
        // ]);
    }
}
