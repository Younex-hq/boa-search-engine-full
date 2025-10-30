<?php

namespace App\Policies\V1;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
  use HandlesAuthorization;

  /**
   * Determine if the user can view any users.
   */
  public function viewAny(User $user)
  {
    return true; // All authenticated users can view the list of users
  }

  /**
   * Determine if the user can view the user.
   */
  public function view(User $user, User $model)
  {
    // Users can view their own profile or admins can view any profile
    return $user->id === $model->id || $user->is_admin;
  }

  /**
   * Determine if the user can create users.
   */
  public function create(User $user)
  {
    return $user->is_admin; // Only admins can create users
  }

  /**
   * Determine if the user can update the user.
   */
  public function update(User $user, User $model)
  {
    // Users can update their own profile or admins can update any profile
    // Regular users cannot modify the is_admin field
    return $user->id === $model->id || $user->is_admin;
  }

  /**
   * Determine if the user can delete the user.
   */
  public function delete(User $user, User $model)
  {
    // Only admins can delete users, and they cannot delete themselves
    return $user->is_admin && $user->id !== $model->id;
  }
}
