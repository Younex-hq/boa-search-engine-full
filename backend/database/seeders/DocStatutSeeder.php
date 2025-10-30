<?php

namespace Database\Seeders;

use App\Models\DocStatut;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocStatutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $docStatuts = [
            ['name' => 'New'],
            ['name' => 'Updates'],
            ['name' => 'Cancels'],
            ['name' => 'Updated'],
            ['name' => 'Canceled'],
        ];

        foreach ($docStatuts as $docStatut) {
            DocStatut::create($docStatut);
        }
    }
}
