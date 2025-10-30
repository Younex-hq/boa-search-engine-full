<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait FuzzyMatch
{
    // Cache for computed Levenshtein ratios to avoid re-computation
    private $ratioCache = [];

    // fuzzy match a string against a search term
    protected function fuzzyMatch($string, $search, $threshold = 0.7)
    {
        return $this->levenshteinRatio($string, $search) >= $threshold;
    }

    //  Check if any word in the string fuzzy matches the search word
    protected function fuzzyMatchWord($string, $searchWord, $threshold = 0.8)
    {
        // Split the string into words
        $words = explode(' ', $string);
        $searchWordLen = mb_strlen($searchWord);

        foreach ($words as $word) {
            $wordLen = mb_strlen($word);

            // Optimization: only compare words with similar length
            // This avoids costly computations for words that are unlikely to be a match
            if ($wordLen > 2 && abs($wordLen - $searchWordLen) < 4) { // Only consider words longer than 2 characters and with a length difference of less than 4
                if ($this->levenshteinRatio($word, $searchWord) >= $threshold) {
                    return true;
                }
            }
        }

        return false;
    }
    private function levenshteinRatio($str1, $str2)
    {
        $len1 = mb_strlen($str1, 'UTF-8');
        $len2 = mb_strlen($str2, 'UTF-8');

        // Generate a unique cache key for the pair of strings
        $cacheKey = $str1 < $str2 ? "{$str1}-{$str2}" : "{$str2}-{$str1}";

        // Return cached ratio if available
        if (isset($this->ratioCache[$cacheKey])) {
            return $this->ratioCache[$cacheKey];
        }

        if ($len1 < 1 || $len2 < 1) {
            return 0;
        }

        $distance = levenshtein($str1, $str2);
        $maxLen = max($len1, $len2);

        $ratio = 1 - ($distance / $maxLen);

        // Cache the computed ratio
        $this->ratioCache[$cacheKey] = $ratio;

        return $ratio;
    }
}
