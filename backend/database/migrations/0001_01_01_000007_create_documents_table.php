<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('documents', function (Blueprint $table) {
      $table->id();
      $table->string('title', 500); // varchar(500)
      $table->enum('type', ['pdf']);
      $table->foreignId('direction_id')->nullable()->constrained('directions')->nullOnDelete();
      $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
      $table->date('document_creation_date')->nullable();
      $table->foreignId('doc_type_id')->nullable()->constrained('doc_types')->nullOnDelete();
      $table->foreignId('doc_statut_id')->nullable()->constrained('doc_statuts')->nullOnDelete();
      $table->foreignId('related_document')->nullable()->constrained('documents')->nullOnDelete();
      $table->longBlob('file'); // hold up to 4G of data in mysql it is limited to 40Mo
      $table->string('file_sha256', 64)->unique('idx_unique_file_sha256'); // for the SHA-256 hash with unique index 
      $table->longText('extracted_text')->nullable();
      $table->boolean('is_active')->default(true)->nullable(false); // Flag to indicate if document is active
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('documents');
  }
};
