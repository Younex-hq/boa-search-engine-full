<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    User::create([
      'first_name' => 'notifications',
      'last_name' => 'notifications',
      'email' => 'notifications@restricted.com',
      'password' => Hash::make('passwordrestricted'),
      'direction_id' => null,
      'is_admin' => false,
      'is_active' => false,
      'email_verified_at' => now(),
    ]);

    User::create([
      'first_name' => 'admin',
      'last_name' => 'admin',
      'email' => 'admin@mail.com',
      'password' => Hash::make('password'),
      'direction_id' => null,
      'is_admin' => true,
      'is_active' => true,
      'email_verified_at' => now(),
    ]);

  }
}
