<?php

namespace App\Policies\V1;

use App\Models\DocStatut;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DocStatutPolicy
{
  use HandlesAuthorization;

  /**
   * Determine if the user can view any document statuses.
   */
  public function viewAny(User $user)
  {
    return true; // All authenticated users can view document statuses
  }

  /**
   * Determine if the user can view the document status.
   */
  public function view(User $user, DocStatut $docStatut)
  {
    return true; // All authenticated users can view any document status
  }

  /**
   * Determine if the user can create document statuses.
   */
  public function create(User $user)
  {
    return $user->is_admin; // Only admins can create document statuses
  }

  /**
   * Determine if the user can update the document status.
   */
  public function update(User $user, DocStatut $docStatut)
  {
    return $user->is_admin; // Only admins can update document statuses
  }

  /**
   * Determine if the user can delete the document status.
   */
  public function delete(User $user, DocStatut $docStatut)
  {
    return $user->is_admin; // Only admins can delete document statuses
  }
}
