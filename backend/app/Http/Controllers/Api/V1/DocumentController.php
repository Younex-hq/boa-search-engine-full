<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Filters\V1\DocumentFilter;
use App\Http\Resources\V1\DocumentResource;
use App\Http\Requests\Api\V1\StoreDocumentRequest;
use App\Http\Requests\Api\V1\UpdateDocumentRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\ExtractPdfText;
use App\Traits\NormalizeText;
use Illuminate\Support\Facades\Auth;

class DocumentController extends ApiController
{
    use ExtractPdfText, NormalizeText;

    /**
     * Display a listing of the resource.
     */
    public function index(DocumentFilter $filters)
    {
        return DocumentResource::collection(
            Document::with(['user', 'docType', 'docStatut', 'relatedDocument', 'direction'])->filter($filters)
                ->orderBy('created_at', 'desc')
                ->paginate(100)
        ); // show 100 latest documents
    }

    //  Display the specified resource.
    public function show($doc_id)
    {
        try {
            $document = Document::findOrFail($doc_id);
            return new DocumentResource($document);
        } catch (ModelNotFoundException $exception) {
            return $this->error("Document introuvable.", 404);
        }
    }


    /*
Download the PDF file for the specified document.

@param int $doc_id The document ID // takes int as a parameter
@return \Illuminate\Http\Response // returns http response to the client
*/
    public function downloadPdf($doc_id)
    {
        $document = Document::findOrFail($doc_id);

        if (empty($document->file)) {
            return $this->error("Fichier introuvable, le document demandé ne possède pas de fichier associé.", 404);
        }

        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $document->title) . " - " . $document->id . '.pdf';

        return response($document->file)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"')
            ->header('Content-Length', strlen($document->file));
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentRequest $request)
    {
        // Get the authenticated user
        $user = $request->user();

        Log::info($request->input('data.attributes.docStatut'));
        $model = [
            'title' => $request->input('data.attributes.title'),
            'type' => $request->input('data.attributes.type'),
            'document_creation_date' => $request->input('data.attributes.docCreationDate'),
            'doc_type_id' => $request->input('data.attributes.docType'),
            // 'doc_statut_id' => $statut->id, // if we get the status as string
            'doc_statut_id' => $request->input('data.attributes.docStatut'),
            'user_id' => $user->id, // Use the authenticated user's ID
            'related_document' => $request->input('data.relationships.relatedDocument.data.id'),
            'direction_id' => $user->direction_id,
            // extracted_text will be set automatically when processing the PDF file
        ];

        // Handle file upload if present
        if ($request->hasFile('data.attributes.file')) {
            $file = $request->file('data.attributes.file');
            $fileHash = hash_file('sha256', $file->getRealPath());

            // Check if a document with the same SHA-256 hash already exists
            $existingDocument = Document::where('file_sha256', $fileHash)->first();
            if ($existingDocument) {
                // Return error with existing document details using ApiResponses trait
                return $this->error('A document with the same content already exists in the system.', 422, [
                    'existing_document' => new DocumentResource($existingDocument)
                ]);
            }

            $model['file'] = file_get_contents($file->getRealPath()); // get the temp file path, get the contenet of the file as binay to string, make it ready to be saved in the file column in our model

            $model['file_sha256'] = $fileHash;

            // Use the trait method to extract text from PDF
            $extractedText = $this->extractTextFromPdf($file);

            // Normalize the extracted text using NormalizeText trait
            $model['extracted_text'] = $extractedText ? $this->normalizeText($extractedText) : null;
        }

        // Create the document
        $document = Document::create($model);

        // Check if there's a related document and update its status based on the current document's status
        $document_status_id = $document->doc_statut_id;
        if ($document->related_document && ($document_status_id == 2 || $document_status_id == 3 || $document_status_id == 4 || $document_status_id == 5)) {
            $relatedDocument = Document::find($document->related_document);
            if ($relatedDocument) {
                // If current document status is 2, update related document status to 4
                // If current document status is 3, update related document status to 5
                if ($document_status_id == 2) {
                    $newStatus = 4;
                } elseif ($document_status_id == 3) {
                    $newStatus = 5;
                } elseif ($document_status_id == 4) {
                    $newStatus = 2;
                } elseif ($document_status_id == 5) {
                    $newStatus = 3;
                }

                $relatedDocument->doc_statut_id = $newStatus;
                // Update the related document's related_document field to point to the new document
                $relatedDocument->related_document = $document->id;
                $relatedDocument->save();
            }
        }

        return new DocumentResource($document);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, $document)
    { // PATCH
        // authorization using policy :
        try {
            $target_document = Document::findOrFail($document);
            $user = $request->user();

            if ($user->is_admin) {
                // Admin users should have document:update-any ability
                if (! $user->tokenCan('document:update-any')) {
                    return $this->error('Your token does not have the required permissions.', 403);
                }
            } else {
                // Regular users check based on ownership
                $abilityToCheck = $user->id === $target_document->user_id
                    ? 'document:update-own'
                    : 'document:update-any';

                if (! $user->tokenCan($abilityToCheck)) {
                    return $this->error('Your token does not have the required permissions.', 403);
                }
            }

            // Then check policy
            if (! $user->can('update', $target_document)) {
                return $this->error('You are not authorized to update this document.', 403);
            }



            $attributeMap = [
                // key is the data attribute => value is the attribute on the model
                'data.attributes.title' => 'title',
                // 'data.attributes.type' => 'type', // always pdf for now
                'data.attributes.docCreationDate' => 'document_creation_date',
                'data.attributes.isActive' => 'is_active',

                // Relationships
                'data.attributes.docType' => 'doc_type_id',
                'data.attributes.docStatut' => 'doc_statut_id',
                'data.relationships.relatedDocument.data.id' => 'related_document', // we can add option to change the realted document id
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

            // Handle doc_statut_id if it's a string
            if (isset($attributesToUpdate['doc_statut_id']) && is_string($attributesToUpdate['doc_statut_id'])) {
                $statutName = $attributesToUpdate['doc_statut_id'];
                $statut = \App\Models\DocStatut::where('name', $statutName)->first();
                if (! $statut) {
                    return $this->error('Invalid document status: ' . $statutName, 422);
                }
                $attributesToUpdate['doc_statut_id'] = $statut->id;
            }

            // If the status is 'New' (id 1), ensure there is no related document.
            if (isset($attributesToUpdate['doc_statut_id']) && $attributesToUpdate['doc_statut_id'] == 1) {
                $attributesToUpdate['related_document'] = null;
            }

            // Update the document
            $target_document->update($attributesToUpdate);

            // Handle related document status updates if statut is being updated
            if (isset($attributesToUpdate['doc_statut_id']) && $attributesToUpdate['doc_statut_id']) { // check if the user provided doc status id and if it is not 0 or null
                // Get the related document ID
                $relatedDocumentId = $target_document->related_document;
                if ($relatedDocumentId) {
                    // Retrieve the related document object using the ID
                    $relatedDocument = Document::find($relatedDocumentId);
                    $newStatus = null;
                    $target_document_status_id = $target_document->doc_statut_id;
                    if ($relatedDocument) {
                        // If current document status is 2 (cancel), update related document status to 4 (canceled)
                        // If current document status is 3 (replace), update related document status to 5 (replaced)
                        if ($target_document_status_id == 2) {
                            $newStatus = 4;
                        } elseif ($target_document_status_id == 3) {
                            $newStatus = 5;
                        } elseif ($target_document_status_id == 4) {
                            $newStatus = 2;
                        } elseif ($target_document_status_id == 5) {
                            $newStatus = 3;
                        } else {
                            $newStatus = null;
                        }

                        if ($newStatus) {
                            $relatedDocument->doc_statut_id = $newStatus;
                            $relatedDocument->related_document = $target_document->id;
                            $relatedDocument->save();
                        }
                    }
                }
            }

            return new DocumentResource($target_document); // return the updated version

        } catch (ModelNotFoundException $exception) {
            return $this->error('Document cannot be found.', 404);
        }
    }

    public function userDocs(DocumentFilter $filters, $id)
    {
        try {
            // Check if user exists
            User::findOrFail($id);

            $documents = Document::where('user_id', $id)
                ->with(['user', 'docType', 'docStatut', 'relatedDocument', 'direction'])
                ->filter($filters)
                ->orderBy('created_at', 'desc')
                ->paginate(100);

            return DocumentResource::collection($documents);
        } catch (ModelNotFoundException $exception) {
            return $this->error('User not found.', 404);
        }
        # Note from future me to future me : I don't remember if this method works or it was just an experiment, sorry :)
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $doc_id)
    { // soft delete
        try {
            // Find the document by ID
            $document = Document::findOrFail($doc_id);

            // Get the authenticated user
            $user = $request->user();

            // Policy-based authorization
            if (! $user->can('delete', $document)) {
                return $this->error('You are not authorized to delete this document.', 403);
            }

            // Update is_active to false instead of deleting
            $document->is_active = false;
            $document->save();

            return $this->ok('Document successfully deactivated');
        } catch (ModelNotFoundException $exception) { // if the Document doesn't exist
            return $this->error('Document cannot be found.', 404);
        }
    }


    public function restore(Request $request, $id)
    {
        try {
            $document = Document::findOrFail($id);

            $user = $request->user();
            if (! $user->can('update', $document)) {
                return $this->error('You are not authorized to restore this Document.', 403);
            }

            $document->is_active = true;
            $document->save();

            return $this->ok('Document successfully restored');
        } catch (ModelNotFoundException $e) {
            return $this->error('Documnet not found.', 404);
        }
    }
}
