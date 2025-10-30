<?php

namespace App\Services\Ai\V1;

use App\Interfaces\Ai\V1\AiServiceInterface;

class NullAiService implements AiServiceInterface
{
    /**
     * Returns a null AI response.
     *
     * @param string $query
     * @param array $documentsText
     * @return null
     */
    public function getAiResponse(string $query, array $documentsText): ?string
    {
        return null;
    }
}
