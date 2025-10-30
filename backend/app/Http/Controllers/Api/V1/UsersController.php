<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Filters\V1\UserFilter;
use App\Http\Resources\V1\UserResource;
use App\Models\User;
use App\Http\Requests\Api\V1\StoreUserRequest;
use App\Http\Requests\Api\V1\UpdateUserRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UsersController extends ApiController
{
  // Display a listing of the resource.
  public function index(UserFilter $filters)
  {
    // return UserResource::collection(user::paginate()); // no filters
    // return UserResource::collection(User::filter($filters)->paginate()); // paginated
    return UserResource::collection(User::filter($filters)->get()); // all users no pagination
    // ?filter[isAdmin]=0&filter[isActive]=1&filter[direction]=2&filter[updatedAt]=2023-01-01,2024-01-01
    // localhost:8800/api/v1/users?sort=email,firstName,lastName,isAdmin,createdAt,updatedAt
  }

  // Display the specified resource.
  public function show(User $user)
  {
    return new userResource($user);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreUserRequest $request)
  {
    $model = [
      'email' => $request->input('data.attributes.email'),
      'first_name' => $request->input('data.attributes.firstName'),
      'last_name' => $request->input('data.attributes.lastName'),
      'password' => Hash::make($request->input('data.attributes.password')), // hash the entered password
      'is_admin' => $request->input('data.attributes.isAdmin', false), // Default to false if not provided
      'is_active' => $request->input('data.attributes.isActive', true), // Default to true if not provided
      'direction_id' => $request->input('data.relationships.direction.data.name'),
    ];
    return new UserResource(User::create($model));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateUserRequest $request, $user)
  { // PATCH
    try {
      $target_user = User::findOrFail($user); // check if the user exists

      // Get the authenticated user
      $auth_user = $request->user();

      // Policy-based authorization
      if (! $auth_user->can('update', $target_user)) {
        return $this->error("Vous n'êtes pas autorisé à modifier cet utilisateur.", 403);
      }

      // Define attribute maps based on user role
      $basicAttributeMap = [
        // users and admins can update these
        'data.attributes.email' => 'email',
        'data.attributes.firstName' => 'first_name',
        'data.attributes.lastName' => 'last_name',
        'data.attributes.password' => 'password',
      ];

      $adminAttributeMap = [
        // only admins can update these
        'data.relationships.direction.data.name' => 'direction_id',
        'data.attributes.isAdmin' => 'is_admin',
        'data.attributes.isActive' => 'is_active',
      ];

      // Determine which attribute map to use based on user role
      $attributeMap = $basicAttributeMap;
      if ($auth_user->is_admin) { // if it's admin
        // Merge basic and admin attributes for admin users
        $attributeMap = array_merge($basicAttributeMap, $adminAttributeMap);
      }

      // Hash password if it's being updated
      if ($request->has('data.attributes.password')) {
        $request->merge([
          'data.attributes.password' => Hash::make($request->input('data.attributes.password'))
        ]); // replacing (by merging) the passwrod we get from the request with the hashed one
      }

      // array that has the attributes that we want to update
      $attributesToUpdate = [];

      // we check if the request contains the key, then get its value and add it to the attributesToUpdate[]
      foreach ($attributeMap as $key => $attribute) {
        // check if the request has the input key
        if ($request->has($key)) {
          $attributesToUpdate[$attribute] = $request->input($key);
        }
      }

      $target_user->update($attributesToUpdate); // update
      return new UserResource($target_user); // return the updated version

    } catch (ModelNotFoundException $exception) {
      return $this->error("Utilisateur introuvable.", 404);
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, $user)
  { // soft delete
    try {
      // Find the user by ID
      $target_user = User::findOrFail($user);

      // Get the authenticated user
      $auth_user = $request->user();

      // Policy-based authorization
      if (! $auth_user->can('delete', $target_user)) {
        return $this->error("Vous n'êtes pas autorisé à supprimer cet utilisateur.", 403);
      }

      // Soft delete logic (example: set is_active to false)
      $target_user->is_active = false;
      $target_user->save();

      return $this->ok("Utilisateur désactivé avec succès.");
    } catch (ModelNotFoundException $exception) { // if the Document doesn't exist
      return $this->error("Utilisateur introuvable.", 404);
    }
  }


  public function restore(Request $request, $id)
  {
    try {
      $User = User::findOrFail($id);

      $user = $request->user();
      if (! $user->can('update', $User)) {
        return $this->error("Vous n'êtes pas autorisé à restaurer cet utilisateur.", 403);
      }

      $User->is_active = true;
      $User->save();

      return $this->ok("Utilisateur restauré avec succès.");
    } catch (ModelNotFoundException $e) {
      return $this->error("Utilisateur introuvable.", 404);
    }
  }
}



// * update() json request
/* admin can update everything, user can update his: name, lastname, email, password
{
    "data": {
        "attributes": {
            "firstName": "testName up4",
            "lastName": "testLast",
            "email": "tes@mail.org",
            "isAdmin": 0,
            "isActive": 0,
            "password": "password"
        },
        "relationships": {
            "direction": {
                "data": {
                    "name": 4
                }
            }
        }
    }
}
*/
