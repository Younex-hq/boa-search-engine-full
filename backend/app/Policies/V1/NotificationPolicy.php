<?php

namespace App\Policies\V1;

use App\Models\User;
use App\Models\Notification;

class NotificationPolicy
{
  /**
   * Determine whether the user can view any notifications.
   */
  public function viewAny(User $user): bool
  {
    return $user->is_admin;
  }

  /**
   * Determine whether the user can view the notification.
   */
  public function view(User $user, Notification $notification): bool
  {
    return $user->is_admin || $user->id === $notification->author_id;
  }

  /**
   * Determine whether the user can update the notification.
   */
  public function update(User $user, Notification $notification): bool
  {
    return $user->is_admin;
  }
}
