<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    // Call seeders in the correct order
    $this->call([
        // LocationSeeder::class, // Must be called before DirectionSeeder if using locations
      DirectionSeeder::class,
      UserSeeder::class,
      DocStatutSeeder::class,
      DocTypeSeeder::class,
    ]);

    # Create a document for user with ID 2
    $user = User::find(2);
    Document::factory()
      ->for($user)
      ->create();
  }
}

