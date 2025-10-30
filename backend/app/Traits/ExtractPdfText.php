<?php

namespace App\Traits;

use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

trait ExtractPdfText
{
    /**
     * Extract text from a PDF file
     *
     * @param \Illuminate\Http\UploadedFile $file The uploaded PDF file
     * @return string|null The extracted text or null if extraction failed
     */
    protected function extractTextFromPdf(UploadedFile $file): ?string
    {
        // Only process PDF files
        if ($file->getClientOriginalExtension() !== 'pdf') {
            return null;
        }

        try {
            $pdfParser = new Parser();
            $pdf = $pdfParser->parseFile($file->getRealPath());
            return $pdf->getText();
        } catch (\Exception $e) {
            // Log the error but continue with the upload
            Log::error('PDF text extraction failed: ' . $e->getMessage());
            return null;
        }
    }
}
