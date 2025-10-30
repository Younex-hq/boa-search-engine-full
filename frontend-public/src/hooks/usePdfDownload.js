import { useMutation } from '@tanstack/react-query';
import { fetchPdfBlob } from '../services/api/pdf';

export const usePdfDownload = () => {
  return useMutation({
    mutationFn: fetchPdfBlob,
    onSuccess: (blob, docId) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document_${docId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Download error:', error);
      alert('Failed to download the document.');
    },
  });
};