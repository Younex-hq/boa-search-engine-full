<?php

namespace App\Policies\V1;

use App\Models\Direction;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DirectionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view any directions.
     */
    public function viewAny(User $user)
    {
        return true; // All authenticated users can view directions
    }

    /**
     * Determine if the user can view the direction.
     */
    public function view(User $user, Direction $direction)
    {
        return true; // All authenticated users can view any direction
    }

    /**
     * Determine if the user can create directions.
     */
    public function create(User $user)
    {
        return $user->is_admin; // Only admins can create directions
    }

    /**
     * Determine if the user can update the direction.
     */
    public function update(User $user, Direction $direction)
    {
        return $user->is_admin; // Only admins can update directions
    }

    /**
     * Determine if the user can delete the direction.
     */
    public function delete(User $user, Direction $direction)
    {
        return $user->is_admin;
    }

    /**
     * Determine if the user can restore the direction.
     */
    public function restore(User $user, Direction $direction)
    {
        return $user->is_admin;
    }
}
