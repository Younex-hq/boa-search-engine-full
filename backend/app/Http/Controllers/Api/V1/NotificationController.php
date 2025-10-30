<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Filters\V1\NotificationFilter;
use App\Http\Resources\V1\NotificationResource;
use App\Models\Notification;
use App\Http\Requests\Api\V1\StoreNotificationRequest;
use App\Http\Requests\Api\V1\UpdateNotificationRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class NotificationController extends ApiController
{
  /**
   * Display a listing of the resource.
   */
  public function index(NotificationFilter $filters)
  {
    // Get the authenticated user
    $user = request()->user();

    // Check if user is admin
    if (! $user || ! $user->is_admin) {
      return $this->error("Vous n'êtes pas autorisé à consulter les notifications.", 403);
    }

    return NotificationResource::collection(Notification::filter($filters)->orderBy('created_at', 'desc')->take(30)->get());
    // sorted by default from newest to oldest by creation date, and limited to the latest 30
    // we can filter by : user, isRead, content *text*, created/updated at
    // no sort
    // not ->paginate() because we already have the limit of 30
  }

  //  Display the specified resource.
  public function show($not_id)
  {
    // Get the authenticated user
    $user = request()->user();

    // Check if user is admin
    if (! $user || ! $user->is_admin) {
      return $this->error("Vous n'êtes pas autorisé à consulter les notifications.", 403);
    }

    try {
      $notification = Notification::findOrFail($not_id);
      return new NotificationResource($notification);
    } catch (ModelNotFoundException $exception) {
      return $this->error("Notification introuvable.", 404);
    }
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreNotificationRequest $request)
  {
    // Get the authenticated user
    $user = $request->user();

    $model = [
      'content' => $request->input('data.attributes.content'),
      'author_id' => $user->id, // Use the authenticated user's ID
      'is_read' => false,
    ];

    $notification = Notification::create($model);
    return new NotificationResource($notification);
  }

  public function storePublic(StoreNotificationRequest $request)
  { // for password reset
    $model = [
      'content' => $request->input('data.attributes.content'),
      'author_id' => 1, // No authenticated user
      'is_read' => false,
    ];

    Notification::create($model);
    return $this->ok("Notification créée avec succès.");
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateNotificationRequest $request, $notification)
  { // PATCH
    try {
      $target_notification = Notification::findOrFail($notification);
      $user = $request->user();

      // Check if user is admin
      if (! $user || ! $user->is_admin) {
        return $this->error("Vous n'êtes pas autorisé à modifier les notifications.", 403);
      }

      $attributeMap = [
        'data.attributes.isRead' => 'is_read',
      ];

      // Array that has the attributes that we want to update
      $attributesToUpdate = [];

      // Check if the request contains the key, then get its value and add it to the attributesToUpdate[]
      foreach ($attributeMap as $key => $attribute) {
        // Check if the request has the input key
        if ($request->has($key)) {
          $attributesToUpdate[$attribute] = $request->input($key); // ex: creates this: 'name' => $request->input('data.attributes.name'),
        }
      }

      // Update the notification
      $target_notification->update($attributesToUpdate);

      return new NotificationResource($target_notification); // Return the updated version
    } catch (ModelNotFoundException $exception) {
      return $this->error("Notification introuvable.", 404);
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, $notification_id)
  {
    // * we don't have option of deleting notifications, we update them to be (is_read = true)
    // try {
    //     // Find the notification by ID
    //     $notification = Notification::findOrFail($notification_id);

    //     // Get the authenticated user
    //     $user = $request->user();

    //     // Check if user is admin
    //     if (!$user || !$user->is_admin) {
    //         return $this->error('You are not authorized to delete notifications.', 403);
    //     }

    //     // Delete the notification
    //     $notification->delete();

    //     return $this->ok('Notification successfully deleted');
    // } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $exception) {
    //     return $this->error('Notification cannot be found.', 404);
    // }
  }
}
