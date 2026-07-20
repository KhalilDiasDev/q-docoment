import useSWR from 'swr';
import { listDocuments, DocumentsQuery } from '../services/documents';

export function useDocuments(query: DocumentsQuery = {}) {
  const key = ['documents', query];
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    listDocuments(query),
  );

  return {
    documents: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}
