<?php

namespace App\Traits;


trait NormalizeText
{

    protected function normalizeText($text)
    {
        // Ensure text is valid UTF-8, replacing invalid characters
        if (!mb_check_encoding($text, 'UTF-8')) {
            $text = mb_convert_encoding($text, 'UTF-8', 'ISO-8859-1');
        }
        $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);

        // Convert to lowercase
        $text = mb_strtolower($text, 'UTF-8');

        // Remove accents and standardize punctuation
        $text = $this->removeAccents($text);

        // Remove filler words using regex
        $fillerWords = $this->fillerWords() ?? [];
        if (!empty($fillerWords)) {
            $escapedFillerWords = array_map(function ($word) {
                return preg_quote($word, '/');
            }, $fillerWords);
            $regex = '/\b(' . implode('|', $escapedFillerWords) . ')\b/u';
            $text = preg_replace($regex, ' ', $text);
        }


        // Remove multiple spaces with one space and trim
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);

        return $text;
    }

    private function fillerWords()
    {
        return config('filler_words.fr'); // get the filler words from the config file config/filler_words.php
    }

    protected function removeAccents($text)
    {
        $search = [
            'à',
            'á',
            'â',
            'ã',
            'ä',
            'å',
            'æ',
            'ç',
            'è',
            'é',
            'ê',
            'ë',
            'ì',
            'í',
            'î',
            'ï',
            'ñ',
            'ò',
            'ó',
            'ô',
            'õ',
            'ö',
            'ø',
            'œ',
            'ù',
            'ú',
            'û',
            'ü',
            'ý',
            'ÿ',
            // Apostrophes
            '’',
            '‘',
            // Punctuation to be replaced by space
            ',',
            '?',
            '!',
            ';',
            ':',
            '…',
            '…',
            '.'
        ];
        $replace = [
            'a',
            'a',
            'a',
            'a',
            'a',
            'a',
            'ae',
            'c',
            'e',
            'e',
            'e',
            'e',
            'i',
            'i',
            'i',
            'i',
            'n',
            'o',
            'o',
            'o',
            'o',
            'o',
            'o',
            'oe',
            'u',
            'u',
            'u',
            'u',
            'y',
            'y',
            // Apostrophes
            "'",
            "'",
            // Punctuation
            ' ',
            ' ',
            ' ',
            ' ',
            ' ',
            ' ',
            ' ',
            ' '
        ];
        return str_replace($search, $replace, $text);
    }
}
