<?php

return [
    //   configuration for the AI service.

    'url' => env('AI_URL', "http://localhost:11434/api/chat"),

    'model' => env('AI_MODEL', "deepseek-v3.1:671b-cloud"),

    'source' => env('AI_SOURCE', null), // ollama, gemini, null

    // Total HTTP timeout in seconds for AI requests
    'timeout' => env('AI_TIMEOUT', 30), // 30 serconds then ignore the Ai response

    // how many Documents will be sent to the Ai, if less then 1 it will default to 1
    'max_docs' => env('AI_MAX_DOCUMENTS', 1),

    'api_key' => env('GEMINI_API_KEY', ""),
    'model_gemini' => env('GEMINI_MODEL', 'gemini-2.5-flash-lite'),
];
