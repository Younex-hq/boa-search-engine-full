<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\LocationResource;
use App\Models\Location;
use App\Http\Requests\Api\V1\StoreLocationRequest;
use App\Http\Requests\Api\V1\UpdateLocationRequest;
use Illuminate\Support\Facades\Request;

class LocationController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return LocationResource::collection(location::paginate());
  }

  //   Display the specified resource.
  public function show(Location $location)
  {
    return new LocationResource($location);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreLocationRequest $request)
  {
    //* createing our database record :
    $model = [
      'name' => $request->input('data.attributes.name'),
    ];

    return new LocationResource(Location::create($model));
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateLocationRequest $request, Location $location)
  {
    // Policy-based authorization
    $user = $request->user();
    if (! $user->can('update', $location)) {
      return response()->json(['error' => 'You are not authorized to update this Location.'], 403);
    }
    // Update logic (example: update name)
    $location->name = $request->input('data.attributes.name', $location->name);
    $location->save();
    return new LocationResource($location);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, Location $location)
  {
    // Policy-based authorization
    $user = $request->user();
    if (! $user->can('delete', $location)) {
      return response()->json(['error' => 'You are not authorized to delete this Location.'], 403);
    }
    // Soft delete logic (example: set is_active to false)
    $location->is_active = false;
    $location->save();
    return response()->json(['message' => 'Location successfully deactivated']);
  }
}
