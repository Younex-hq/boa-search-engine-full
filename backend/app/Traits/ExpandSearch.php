<?php

namespace App\Traits;

use App\Traits\NormalizeText;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

trait ExpandSearch
{
  use NormalizeText;

  protected function expandSearchTerms($searchWords)
  {
    if (! is_array($searchWords) || empty($searchWords)) {
      return $searchWords ?: []; // if truthy value return search words, if falsy return empty array
    }

    // Log the original search words
    Log::info('Original search words: '.json_encode($searchWords));

    $expandedTerms = [];

    foreach ($searchWords as $word) {
      // Normalize the original word before adding it
      $normalizedWord = $this->normalizeText($word);

      // Add the normalized original word if it's not empty
      if (!empty($normalizedWord)) {
          $expandedTerms[] = $normalizedWord;
      }

      // Skip empty words
      if (empty(trim($word))) {
        continue;
      }

      try {
        // Add synonyms from Wolf
        $synonyms = $this->getSynonymsFromWolf($word);

        if (is_array($synonyms)) {
          foreach ($synonyms as $synonym) {
            if (strlen($synonym) > 2) { // Only consider synonyms longer than 2 characters
              $expandedTerms[] = $synonym;
            }
          }
        }
      } catch (\Exception $e) {
        Log::error('Error expanding search term: '.$e->getMessage());
        // Continue with next word if there's an error
        continue;
      }
    }

    $uniqueExpandedTerms = array_unique($expandedTerms);

    // Log the final expanded search terms
    Log::info('Expanded search terms: '.json_encode($uniqueExpandedTerms));

    return $uniqueExpandedTerms;
  }


  // ! wolf.xml parser with caching =============================================
  protected function getSynonymsFromWolf($word)
  {
    $wolfPath = storage_path('app/private/wolf-data/wolf-1.0b4.xml');

    // Generate a cache key that includes the file's modification time
    // This ensures that if the XML file is updated, the cache is invalidated
    $fileModTime = @filemtime($wolfPath) ?: 'nofile';
    $cacheKey = 'wolf_synonym_data_v' . $fileModTime;

    // ! Cache for a long time, for 365 days
    // This is a long cache duration to avoid frequent file reads
    $cacheDuration = 60 * 60 * 24 * 365; // 60 seconds * 60 minutes * 24 hours * 365 days

    // Use Cache::remember to get/store the parsed XML data
    $wolfData = Cache::remember($cacheKey, $cacheDuration, function () use ($wolfPath) {
      Log::info('Wolf data not found in cache. Parsing XML file.');


      if (! file_exists($wolfPath)) {
        Log::warning('Wolf XML file not found at: '.$wolfPath);
        return []; // Return empty array if file not found
      }

      try {
        // Load the XML file with error handling
        libxml_use_internal_errors(true); // suppress xml parsing library errors for security
        $xmlContent = file_get_contents($wolfPath);

        if ($xmlContent === false) {
          Log::error('Failed to read Wolf XML file');
          return []; // Return empty array on read failure
        }

        // Parse XML content
        $xml = simplexml_load_string($xmlContent);

        if ($xml === false) {
          $errors = libxml_get_errors(); // get the error we suppressed earlier
          libxml_clear_errors(); // clear the errors
          Log::error('Failed to parse Wolf XML: '.json_encode($errors)); // log the error
          return []; // Return empty array on parse failure
        }

        // Initialize parsed data as empty array
        $parsedData = [];

        // Parse the XML structure to build a synonym dictionary
        foreach ($xml->SYNSET as $synset) {
          // Check if this synset has SYNONYM element
          if (! isset($synset->SYNONYM)) {
            continue;
          }

          // Store the main word and its direct synonyms
          $synsetWords = [];

          // Collect all literals (words) in this synset
          foreach ($synset->SYNONYM->LITERAL as $literal) {
            // In VisDic format, the literal text is the node value, not an attribute
            $literalText = trim((string) $literal);

            // Extract the literal text without the SENSE tag
            // The format is: literal_text<SENSE>sense_number</SENSE>
            $literalText = preg_replace('/<SENSE>.*?<\/SENSE>/s', '', $literalText);

            if (! empty($literalText)) {
              $normalizedLiteral = $this->normalizeText($literalText);
              if (strlen($normalizedLiteral) > 2) { // Only consider words longer than 2 characters
                $synsetWords[] = $normalizedLiteral;
              }
            }
          }

          // Only process if we found at least 2 words in the synset
          if (count($synsetWords) < 2) {
            continue; // means the word is alone and doesn't have synonyms
          }

          // For each word in the synset, store only its direct synonyms
          // This avoids creating a complex network of indirect synonyms // this is important or it will return synonyms of the synonyms...
          foreach ($synsetWords as $synsetWord) {
            if (! isset($parsedData[$synsetWord])) {
              $parsedData[$synsetWord] = [];
            }

            // Get direct synonyms (only from this synset)
            $directSynonyms = array_values(array_filter(
              $synsetWords,
              fn ($synonym) => $synonym !== $synsetWord
            ));

            // Add direct synonyms to the word's synonym list
            $parsedData[$synsetWord] = array_unique(array_merge($parsedData[$synsetWord], $directSynonyms));
          }
        }

        Log::info('Wolf XML parsed and cached successfully. Found '.count($parsedData).' words with synonyms.');
        return $parsedData; // This data will be cached
      } catch (\Exception $e) {
        Log::error('Exception parsing Wolf XML for cache: '.$e->getMessage());
        return []; // Return empty array on any other exception
      }
    });

    // Normalize the input word
    $normalizedWord = $this->normalizeText($word);

    // Get synonyms if found - use null coalesce operator
    $wordSynonyms = $wolfData[$normalizedWord] ?? [];

    // Reduce logging to improve performance
    if (! empty($wordSynonyms)) {
      Log::debug("Found ".count($wordSynonyms)." synonyms for '{$normalizedWord}'");
    }

    return $wordSynonyms;
  }
}
