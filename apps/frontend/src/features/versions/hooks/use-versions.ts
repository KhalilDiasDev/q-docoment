import useSWR from 'swr';
import { listVersions } from '../services/versions';

export function useVersions(documentId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    documentId ? ['versions', documentId] : null,
    () => listVersions(documentId as string),
  );

  return {
    versions: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}
