<?php

namespace App\Policies\V1;

use App\Models\Location;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LocationPolicy
{
  use HandlesAuthorization;

  /**
   * Determine if the user can view any locations.
   */
  public function viewAny(User $user)
  {
    return true; // All authenticated users can view locations
  }

  /**
   * Determine if the user can view the location.
   */
  public function view(User $user, Location $location)
  {
    return true; // All authenticated users can view any location
  }

  /**
   * Determine if the user can create locations.
   */
  public function create(User $user)
  {
    return $user->is_admin; // Only admins can create locations
  }

  /**
   * Determine if the user can update the location.
   */
  public function update(User $user, Location $location)
  {
    return $user->is_admin; // Only admins can update locations
  }

  /**
   * Determine if the user can delete the location.
   */
  public function delete(User $user, Location $location)
  {
    return $user->is_admin; // Only admins can delete locations
  }
}
