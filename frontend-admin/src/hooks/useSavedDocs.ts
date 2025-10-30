import { useState, useEffect, useCallback } from 'react';
import { type Document } from '@/api/doc.api';
import { getFromStorage, saveToStorage } from '@/lib/storage';

const SAVED_DOCS_KEY = 'savedDocs';

export const useSavedDocs = () => {
  const [savedDocs, setSavedDocs] = useState<Document[]>([]);

  useEffect(() => {
    const docs = getFromStorage<Document[]>(SAVED_DOCS_KEY);
    if (docs) {
      setSavedDocs(docs);
    }
  }, []);

  const saveDoc = useCallback((doc: Document) => {
    setSavedDocs(prevDocs => {
      const newDocs = [doc, ...prevDocs];
      saveToStorage(SAVED_DOCS_KEY, newDocs);
      return newDocs;
    });
  }, []);

  const unSaveDoc = useCallback((docId: number) => {
    setSavedDocs(prevDocs => {
      const newDocs = prevDocs.filter(d => d.id !== docId);
      saveToStorage(SAVED_DOCS_KEY, newDocs);
      return newDocs;
    });
  }, []);

  const isDocSaved = useCallback((docId: number) => {
    return savedDocs.some(d => d.id === docId);
  }, [savedDocs]);

  return { savedDocs, saveDoc, unSaveDoc, isDocSaved };
};