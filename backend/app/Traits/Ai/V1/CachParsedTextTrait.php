<?php

namespace App\Traits\Ai\V1;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

trait CachParsedTextTrait
{
  /**
   * Cache the parsed text of a document.
   *
   * @param int $docId
   * @param string $title
   * @param string $content
   * @return bool
   */
  protected function cacheParsedText($docId, $title, $content)
  {
    try {
      $directory = storage_path('app/private/parsed_texts');
      if (!File::exists($directory)) {
        File::makeDirectory($directory, 0755, true);
      }

      $filePath = $directory . '/' . $docId . '.json';
      $data = [
        'title' => $title,
        'content' => $content,
      ];

      File::put($filePath, json_encode($data, JSON_PRETTY_PRINT));
      $this->clearOldCacheFiles($directory);


      return true;
    } catch (\Exception $e) {
      Log::error('Error caching parsed text for doc ' . $docId . ': ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Get the cached parsed text of a document.
   *
   * @param int $docId
   * @return object|null
   */
  protected function getCachedParsedText($docId)
  {
    $filePath = storage_path('app/private/parsed_texts/' . $docId . '.json');

    if (File::exists($filePath)) {
      $data = json_decode(File::get($filePath));
      return $data;
    }

    return null;
  }

  /**
   * Clear cache files older than a week.
   *
   * @param string $directory
   * @return void
   */
  protected function clearOldCacheFiles($directory)
  {
    $files = File::files($directory);
    $oneWeekAgo = now()->subWeek();

    foreach ($files as $file) {
      if ($oneWeekAgo->getTimestamp() > $file->getMTime()) {
        File::delete($file->getPathname());
      }
    }
  }
}