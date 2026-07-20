import { api } from '@/lib/axios';
import type { Project } from '@doc-versioning/types';

export async function listProjects(): Promise<Project[]> {
  const { data } = await api.get('/projects');
  return data;
}

export async function createProject(params: {
  name: string;
  slug: string;
}): Promise<Project> {
  const { data } = await api.post('/projects', params);
  return data;
}
