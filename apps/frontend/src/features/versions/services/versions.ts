import { api } from '@/lib/axios';
import type { Version } from '@doc-versioning/types';

export async function listVersions(documentId: string): Promise<Version[]> {
  const { data } = await api.get(`/documents/${documentId}/versions`);
  return data;
}

export async function restoreVersion(documentId: string, versionId: string) {
  const { data } = await api.post(
    `/documents/${documentId}/versions/${versionId}/restore`,
  );
  return data;
}

export async function approveVersion(
  documentId: string,
  versionId: string,
  version: { major: number; minor: number },
) {
  const { data } = await api.post(
    `/documents/${documentId}/versions/${versionId}/approve`,
    version,
  );
  return data;
}
