import { api } from '@/lib/axios';
import type { Document, DocumentCategory, DocumentStatus } from '@doc-versioning/types';

export interface DocumentsQuery {
  projectId?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
}

export async function listDocuments(query: DocumentsQuery = {}): Promise<Document[]> {
  const { data } = await api.get('/documents', { params: query });
  return data;
}

export async function getDocument(id: string): Promise<Document> {
  const { data } = await api.get(`/documents/${id}`);
  return data;
}

export async function createDocument(params: {
  projectId: string;
  fileName: string;
  category: DocumentCategory;
  file: File;
}): Promise<Document> {
  const form = new FormData();
  form.append('projectId', params.projectId);
  form.append('fileName', params.fileName);
  form.append('category', params.category);
  form.append('file', params.file);

  const { data } = await api.post('/documents', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadNewVersion(params: {
  documentId: string;
  file: File;
  message?: string;
}): Promise<Document> {
  const form = new FormData();
  form.append('file', params.file);
  if (params.message) form.append('message', params.message);

  const { data } = await api.patch(`/documents/${params.documentId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
