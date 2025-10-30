<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\DocStatut;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\DocStatutResource;
use App\Http\Requests\Api\V1\StoreDocStatutRequest;
use App\Http\Requests\Api\V1\UpdateDocStatutRequest;
use Illuminate\Support\Facades\Request;

class DocStatutController extends Controller
{
  //   Display a listing of the resource.
  public function index()
  {
    return DocStatutResource::collection(DocStatut::paginate());
  }

  //  Display the specified resource.
  public function show(DocStatut $docStatut)
  {
    return new DocStatutResource($docStatut);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreDocStatutRequest $request)
  {
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateDocStatutRequest $request, DocStatut $docStatut)
  {
    // Policy-based authorization
    $user = $request->user();
    if (! $user->can('update', $docStatut)) {
      return response()->json(['error' => "Vous n'êtes pas autorisé à modifier ce DocStatut."], 403);
    }
    // Update logic (example: update name)
    $docStatut->name = $request->input('data.attributes.name', $docStatut->name);
    $docStatut->save();
    return new DocStatutResource($docStatut);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, DocStatut $docStatut)
  {
    // Policy-based authorization
    $user = $request->user();
    if (! $user->can('delete', $docStatut)) {
      return response()->json(['error' => "Vous n’êtes pas autorisé à supprimer ce DocStatut."], 403);
    }
    // Soft delete logic (example: set is_active to false)
    $docStatut->is_active = false;
    $docStatut->save();
    return response()->json(['message' => "DocStatut désactivé avec succès."]);
  }
}
