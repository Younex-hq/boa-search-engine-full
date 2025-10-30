<?php

namespace App\Policies\V1;

use App\Models\Document;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Carbon\Carbon;

class DocumentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view any documents.
     */
    public function viewAny(User $user)
    {
        return true; // All authenticated users can view documents
    }

    /**
     * Determine if the user can view the document.
     */
    public function view(User $user, Document $document)
    {
        return true; // All authenticated users can view any document
    }

    /**
     * Determine if the user can create documents.
     */
    public function create(User $user)
    {
        return true; // All authenticated users can create documents
    }

    /**
     * Determine if the user can update the document.
     */
    public function update(User $user, Document $document)
    {
        // Check if document is older than 10 days
        $tenDaysAgo = now()->subDays(10);
        $isOlderThanTenDays = $document->created_at->lt($tenDaysAgo);

        // Admin can update any document regardless of age
        if ($user->is_admin) {
            return true;
        }

        // Regular users can only update their own documents that are less than 10 days old
        return $user->id === $document->user_id && ! $isOlderThanTenDays;
    }

    /**
     * Determine if the user can delete the document.
     */
    public function delete(User $user, Document $document)
    {
        // Check if document is older than 10 days
        $tenDaysAgo = now()->subDays(10);
        $isOlderThanTenDays = $document->created_at->lt($tenDaysAgo);

        // Admin can delete any document regardless of age
        if ($user->is_admin) {
            return true;
        }

        // Regular users can only delete their own documents that are less than 4 days old
        return $user->id === $document->user_id && ! $isOlderThanTenDays;
    }
}
