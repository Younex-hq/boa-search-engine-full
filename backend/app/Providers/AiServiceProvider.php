<?php

namespace App\Providers;

use App\Interfaces\Ai\V1\AiServiceInterface;
use App\Services\Ai\V1\GeminiAiService;
use App\Services\Ai\V1\OllamaAiService;
use App\Services\Ai\V1\NullAiService;
use Illuminate\Support\ServiceProvider;

class AiServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(AiServiceInterface::class, function ($app) {
            $aiSource = config('ai.source');

            if ($aiSource === 'gemini') {
                return new GeminiAiService();
            } elseif ($aiSource === 'ollama') {
                return new OllamaAiService();
            } else {
                return new NullAiService();
            }
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}