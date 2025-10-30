<?php

namespace App\Policies\V1;

use App\Models\DocType;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DocTypePolicy
{
  use HandlesAuthorization;

  /**
   * Determine if the user can view any document types.
   */
  public function viewAny(User $user)
  {
    return true; // All authenticated users can view document types
  }

  /**
   * Determine if the user can view the document type.
   */
  public function view(User $user, DocType $docType)
  {
    return true; // All authenticated users can view any document type
  }

  /**
   * Determine if the user can create document types.
   */
  public function create(User $user)
  {
    return $user->is_admin; // Only admins can create document types
  }

  /**
   * Determine if the user can update the document type.
   */
  public function update(User $user, DocType $docType)
  {
    return $user->is_admin; // Only admins can update document types
  }

  /**
   * Determine if the user can delete the document type.
   */
  public function delete(User $user, DocType $docType)
  {
    return $user->is_admin; // Only admins can delete document types
  }
}
