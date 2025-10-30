<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Seeder;

class DocumentOnlySeeder extends Seeder
{
  public function run(): void
  {
    // Get existing users or create some if needed
    $users = User::all()->count() > 0 ? User::all() : User::factory(3)->create();

        // Create documents and associate with users - create only 1 document as a start
        Document::factory(1)
            ->recycle($users)
            ->create();
    }
}

//  php artisan db:seed --class=DocumentOnlySeeder

