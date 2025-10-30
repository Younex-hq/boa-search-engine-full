<?php

namespace Database\Factories;

use App\Models\Direction;
use App\Models\DocStatut;
use App\Models\DocType;
use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DocumentFactory extends Factory
{
  protected $model = Document::class;

  public function definition(): array
  {
    // Generate a simple PDF-like content for testing
    $dummyContent = "%PDF-1.5\n".Str::random(500)."\n%%EOF";

    // Generate SHA-256 hash for the dummy content
    $fileSha256 = hash('sha256', $dummyContent);

        return [
            'title' => $this->faker->sentence(4),
            'type' => 'pdf',
            'direction_id' => Direction::inRandomOrder()->first()?->id,
            'user_id' => User::inRandomOrder()->first()?->id,
            'document_creation_date' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'doc_type_id' => DocType::inRandomOrder()->first()?->id,
            'doc_statut_id' => DocStatut::inRandomOrder()->first()?->id,
            'related_document' => null, 
            'file' => $dummyContent,
            'file_sha256' => $fileSha256,
            'extracted_text' => $this->faker->paragraphs(3, true),
        ];
    }

  /**
   * Configure the model factory to set a related document.
   *
   * @return $this
   */
  public function withRelatedDocument(?Document $document = null)
  {
    return $this->state(function (array $attributes) use ($document) {
      return [
        'related_document' => $document ? $document->id : Document::inRandomOrder()->first()?->id,
      ];
    });
  }
}
