<?php

namespace App\Interfaces\Ai\V1;

interface AiServiceInterface
{
    /**
     * Get AI response for a given query and context documents.
     *
     * @param string $query
     * @param array $docsText
     * @return string
     */
    public function getAiResponse(string $query, array $docsText): ?string;
}
