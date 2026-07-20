import useSWR from 'swr';
import { listProjects } from '../services/projects';

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR('projects', listProjects);

  return {
    projects: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}
