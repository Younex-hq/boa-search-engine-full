<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Filters\V1\DirectionFilter;
use App\Http\Resources\V1\DirectionResource;
use App\Models\Direction;
use App\Http\Requests\Api\V1\StoreDirectionRequest;
use App\Http\Requests\Api\V1\UpdateDirectionRequest;
use App\Policies\V1\DirectionPolicy;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DirectionController extends ApiController
{
  protected $policyClass = DirectionPolicy::class;

  /**
   * Display a listing of the resource.
   */
  public function index(DirectionFilter $filters)
  {
    return DirectionResource::collection(direction::filter($filters)->get());
    // localhost:8800/api/v1/directions?filter[isActive]=1&filter[parentDirection]=2&filter[location]=3&filter[createdAt]=2025-01-01,2026-01-01
    // localhost:8800/api/v1/directions?sort=-name,isActive,createdAt,updatedAt

  }

  // Display the specified resource.
  public function show(Direction $direction)
  {
    return new DirectionResource($direction);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreDirectionRequest $request)
  {
    try {
      $user = $request->user();
      if (! $user->can('create', Direction::class)) {
        return $this->error('You are not authorized to create a Direction.', 403);
      }

      $model = [
        'name' => $request->input('data.attributes.name'),
        'location_id' => $request->input('data.attributes.location'),
        'parent_direction_id' => $request->input('data.relationships.parent.data.name'),
      ];

      $direction = Direction::create($model);
      return new DirectionResource($direction);
    } catch (\Exception $e) {
      return $this->error('An error occurred while creating the Direction.', 500);
    }
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateDirectionRequest $request, $direction)
  { // PATCH
    try {
      $target_direction = Direction::findOrFail($direction); // check if the docType exists

      // Get the authenticated user
      $user = $request->user();
      // Policy-based authorization
      if (! $user->can('update', $target_direction)) {
        return $this->error('You are not authorized to update this Direction.', 403);
      }

      $attributeMap = [
        // key is the data attribute => value is the attribute on the model
        'data.attributes.name' => 'name',
        'data.attributes.isActive' => 'is_active',
        'data.attributes.location' => 'location_id',
        'data.relationships.parent.data.name' => 'parent_direction_id',
      ];

      // array that has the attributs that we want to update
      $attributesToUpdate = [];

      // we check if the reqeust contains the key, then get its value and add it to the attributesToUpdate[]
      foreach ($attributeMap as $key => $attribute) {
        // check if the request has the input key
        if ($request->has($key)) {
          $attributesToUpdate[$attribute] = $request->input($key); // ex: creates this: 'name' => $request->input('data.attributes.name'),
        }
      }

      $target_direction->update($attributesToUpdate); // update
      return new DirectionResource($target_direction); // return the updated version

    } catch (ModelNotFoundException $exception) {
      return $this->error('Direction cannot be found.', 404);
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, $direction)
  { // soft delete
    try {
      // Find the Direction by ID
      $target_direction = Direction::findOrFail($direction);

      // Get the authenticated user
      $user = $request->user();

      // Policy-based authorization
      if (! $user->can('delete', $target_direction)) {
        return $this->error('You are not authorized to delete this Direction.', 403);
      }

      // Soft delete logic (set is_active to false)
      $target_direction->is_active = false;
      $target_direction->save();

      return $this->ok('Direction successfully deactivated');
    } catch (ModelNotFoundException $exception) {
      return $this->error('Direction cannot be found.', 404);
    }
  }

  public function restore(Request $request, $direction)
  {
    try {
      // Find the Direction by ID
      $target_direction = Direction::findOrFail($direction);

      $user = $request->user();
      if (! $user->can('restore', $target_direction)) {
        return $this->error('You are not authorized to restore this Direction.', 403);
      }

      $target_direction->is_active = true;
      $target_direction->save();

      return $this->ok('Direction successfully restored');
    } catch (ModelNotFoundException $e) {
      return $this->error('Direction not found.', 404);
    }
  }
}


// * update() json reqeust :
// localhost:8800/api/v1/directions/6
/*
{
    "data": {
        "attributes": {
            "name": "test 2 updated",
            "isActive": 1,
            "location": 2
        },
        "relationships": {
            "parent": {
                "data": {
                    "name": 4
                }
            }
        }
    }
}
*/
