<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\DocType;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\DocTypeResource;
use App\Http\Requests\Api\V1\StoreDocTypeRequest;
use App\Http\Requests\Api\V1\UpdateDocTypeRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DocTypeController extends ApiController
{
  //   Display a listing of the resource.
  public function index()
  {
    return DocTypeResource::collection(DocType::paginate());
  }


  //   Display the specified resource.
  public function show(DocType $docType)
  {
    return new DocTypeResource($docType);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreDocTypeRequest $request)
  {
    // we don't need to validate the request because we already did it in the StoreDocTypeRequest class
    // if this code gonna execute means we have a valid request

    //* createing our database record :
    $model = [
      'name' => $request->input('data.attributes.name'),
      'is_active' => $request->input('data.attributes.isActive', 1), // Default to 1 if not provided
    ];

    return new DocTypeResource(DocType::create($model));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateDocTypeRequest $request, $docType)
  { // PATCH
    try {
      $target_docType = DocType::findOrFail($docType); // check if the docType exists

      // Get the authenticated user
      $user = $request->user();
      // Policy-based authorization
      if (! $user->can('update', $target_docType)) {
        return $this->error("Vous n'êtes pas autorisé à modifier ce DocType.", 403);
      }

      $attributeMap = [
        // key is the data attribute => value is the attribute on the model
        'data.attributes.name' => 'name',
        'data.attributes.isActive' => 'is_active',
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

      $target_docType->update($attributesToUpdate); // update
      return new DocTypeResource($target_docType); // return the updated version

    } catch (ModelNotFoundException $exception) {
      return $this->error("DocType introuvable.", 404);
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, $docType)
  { // soft delete
    try {
      // Find the docType by ID
      $target_docType = DocType::findOrFail($docType);

      // Get the authenticated user
      $user = $request->user();

      // Policy-based authorization
      if (! $user->can('delete', $target_docType)) {
        return $this->error("Vous n'êtes pas autorisé à supprimer ce DocType.", 403);
      }

      // Soft delete logic (example: set is_active to false)
      $target_docType->is_active = false;
      $target_docType->save();

      return $this->ok("DocType désactivé avec succès.");
    } catch (ModelNotFoundException $exception) { // if the DocType doesn't exist
      return $this->error("DocType introuvable.", 404);
    }
  }
}
