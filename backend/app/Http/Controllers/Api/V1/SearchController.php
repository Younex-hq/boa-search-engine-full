<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Document;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\ApiController;
use App\Http\Resources\V1\SearchResource;
use App\Interfaces\Ai\V1\AiServiceInterface;
use App\Traits\ExpandSearch;
use App\Traits\NormalizeText;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use App\Traits\Ai\V1\CachParsedTextTrait;

class SearchController extends ApiController
{
    use ExpandSearch, NormalizeText, CachParsedTextTrait;

    protected $aiService;

    public function __construct(AiServiceInterface $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Search for documents based on a query string
     *
     * @param string $query The search query
     * @param Request $request The HTTP request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function index($query, Request $request)
    {
        // Validate search query
        if (empty($query) || strlen($query) < 2) {
            return $this->error("La recherche doit contenir au moins 2 caractères.", 400);
        }

        try {


            // Normalize the search query
            $normalizedQuery = $this->normalizeText($query);

            // Split the normalized query into individual words
            $searchWords = array_filter(explode(' ', $normalizedQuery));

            // If no valid search words after normalization, return error
            if (empty($searchWords)) {
                return $this->error("Aucun terme de recherche valide trouvé après normalisation, il s'agit peut-être d'un mot de remplissage.", 400);
            }

            // Expand search terms with synonyms
            $expandedSearchWords = $this->expandSearchTerms($searchWords);

            // Get all active documents with only the fields we need
            $documents = Document::where('is_active', true)
                ->select([
                    'id',
                    'title',
                    'extracted_text',
                    'doc_type_id',
                    'doc_statut_id',
                    'direction_id',
                    'document_creation_date',
                    'related_document',
                    // 'file'
                ])
                ->get();

            // Array to store search results with relevance scores
            $results = [];

            // Define score weights for different match types
            $scoreWeights = [
                'title_exact_full' => 100,
                'title_fuzzy_full' => 80,
                'content_exact_full' => 70,
                'content_fuzzy_full' => 60,
                'title_exact_word' => 50,
                'title_fuzzy_word' => 40,
                'content_exact_word' => 30,
                'content_fuzzy_word' => 20
            ];

            // Loop through each document
            foreach ($documents as $document) {
                // Initialize relevance score
                $score = 0;

                // Normalize document title
                $normalizedTitle = $this->normalizeText($document->title);

                // Get document content (extracted text)
                $normalizedContent = $document->extracted_text ?? ''; // if null return ''

                // Check for full phrase exact match in title
                if (strpos($normalizedTitle, $normalizedQuery) !== false) { // strpos() returns the integer position of the first occurrence of the substring in the string, or false if the substring is not found
                    $score += $scoreWeights['title_exact_full'];
                }

                // Check for full phrase fuzzy match in title
                elseif (levenshtein($normalizedTitle, $normalizedQuery) <= 3) { // how many characters are different
                    $score += $scoreWeights['title_fuzzy_full'];
                }

                // Check for full phrase exact match in content
                if (strpos($normalizedContent, $normalizedQuery) !== false) {
                    $score += $scoreWeights['content_exact_full'];
                }

                // Check for full phrase fuzzy match in content if not longer than 500 characters, first experiment was 250
                elseif (strlen($normalizedContent) <= 500 && levenshtein($normalizedContent, $normalizedQuery) <= 5) {
                    $score += $scoreWeights['content_fuzzy_full'];
                    // run the fuzzy match only if the content is not too long, levenshtein() gets slow and resource heavy for long text (we set limit at 500 characters)
                }

                // Check for individual word matches (including synonyms)
                foreach ($expandedSearchWords as $word) {
                    // Skip very short words (less than 3 characters)
                    if (strlen($word) < 3) {
                        continue;
                    }

                    // Check for exact word match in title
                    if (strpos($normalizedTitle, $word) !== false) {
                        $score += $scoreWeights['title_exact_word'];
                    }

                    // Check for fuzzy word match in title
                    elseif (levenshtein($normalizedTitle, $word) <= 2) {
                        $score += $scoreWeights['title_fuzzy_word'];
                    }

                    // Check for exact word match in content
                    if (strpos($normalizedContent, $word) !== false) {
                        $score += $scoreWeights['content_exact_word'];
                    }

                    // Check for fuzzy word match in content (words under 20 characters)
                    elseif (strlen($word) <= 20 && strpos($normalizedContent, substr($word, 0, strlen($word) - 1)) !== false) {
                        $score += $scoreWeights['content_fuzzy_word'];
                    }
                }

                // If document has a positive score, add it to results
                if ($score > 0) {
                    $document->relevance_score = $score;
                    $results[] = $document;
                }
            }

            // Sort results by relevance score (descending)
            // usort() It modifies the array in-place, it doesn’t return a new one
            usort($results, fn($a, $b) => $b->relevance_score - $a->relevance_score);
            // 0 if equal, <0 if $a < $b, >0 if $a > $b

            // Take only the first 30 results without pagination
            $limitedResults = array_slice($results, 0, 30);

            //! Get AI response
            $topResultsForAi = array_slice($limitedResults, 0, max(1, config('ai.max_docs')));
            $docsText = [];
            foreach ($topResultsForAi as $doc) {
                $docsText[] = (object)[
                    'title' => $doc->title,
                    'content' => $doc->extracted_text,
                ];
            }
            Log::info('document sent to AI:', ['docsText' => $docsText]);

            $aiResponse = $this->aiService->getAiResponse($query, $docsText);

            $responseData = [
                'meta' => [
                    'total_results' => count($results),
                    'query' => $query,
                    'normalized_query' => $normalizedQuery,
                ]
            ];

            if ($aiResponse !== null) {
                $responseData['meta']['ai_response'] = $aiResponse;
            }

            // Return results as resource collection with metadata
            return SearchResource::collection($limitedResults)
                ->additional($responseData);
        } catch (\Exception $e) {
            Log::error('Search error: ' . $e->getMessage());
            return $this->error("Une erreur s'est produite lors du traitement de votre recherche.", 500);
        }
    }
}
