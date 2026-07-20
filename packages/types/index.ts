// Tipos compartilhados entre api <-> frontend

export type DocumentCategory = "PDF" | "PPTX" | "VIDEO" | "IMAGE";

export type DocumentStatus = "RASCUNHO" | "REVISAO" | "FINAL" | "APROVADO";

export interface Project {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Document {
  id: string;
  projectId: string;
  fileName: string;
  filePath: string;
  category: DocumentCategory;
  status: DocumentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Version {
  id: string;
  documentId: string;
  commitSha: string;
  tag: string | null;
  message: string;
  authorName: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "member" | "admin";
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface CreateDocumentPayload {
  projectId: string;
  fileName: string;
  category: DocumentCategory;
}

export interface RestoreVersionPayload {
  versionId: string;
}
