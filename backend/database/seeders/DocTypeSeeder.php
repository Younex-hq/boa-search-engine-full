<?php

namespace Database\Seeders;

use App\Models\DocType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $docTypes = [
            ['name' => 'Note', 'is_active' => true],
            // ['name' => 'Repport', 'is_active' => true],
        ];

    foreach ($docTypes as $docType) {
      DocType::create($docType);
    }
  }
}
