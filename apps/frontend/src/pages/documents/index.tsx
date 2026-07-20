import { useState } from 'react';
import { useRouter } from 'next/router';
import type { Document } from '@doc-versioning/types';
import { useDocuments } from '@/features/documents/hooks/use-documents';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { DocumentsTable } from '@/features/documents/components/DocumentsTable';
import { DocumentUploadDialog } from '@/features/documents/components/DocumentUploadDialog';
import { VersionHistoryModal } from '@/features/versions/components/VersionHistoryModal';
import { ProjectSelector } from '@/features/projects/components/ProjectSelector';
import { ProjectCreateDialog } from '@/features/projects/components/ProjectCreateDialog';
import { clearToken } from '@/lib/auth';

export default function DocumentsPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const { documents, isLoading, refresh } = useDocuments(
    projectId ? { projectId } : {},
  );
  const { projects, refresh: refreshProjects } = useProjects();

  const [showUpload, setShowUpload] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [historyDoc, setHistoryDoc] = useState<Document | null>(null);

  function handleLogout() {
    clearToken();
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-900">
            Doc Versioning
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <ProjectSelector
            projects={projects}
            value={projectId}
            onChange={setProjectId}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewProject(true)}
              className="rounded-md border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 hover:bg-slate-50"
            >
              Novo projeto
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="rounded-md bg-slate-900 text-white text-sm font-medium px-4 py-2 hover:bg-slate-800"
            >
              Novo documento
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          {isLoading ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              Carregando...
            </p>
          ) : (
            <DocumentsTable
              documents={documents}
              onOpenHistory={setHistoryDoc}
            />
          )}
        </div>
      </div>

      {showUpload && (
        <DocumentUploadDialog
          projects={projects}
          onClose={() => setShowUpload(false)}
          onCreated={refresh}
        />
      )}

      {showNewProject && (
        <ProjectCreateDialog
          onClose={() => setShowNewProject(false)}
          onCreated={refreshProjects}
        />
      )}

      {historyDoc && (
        <VersionHistoryModal
          document={historyDoc}
          onClose={() => setHistoryDoc(null)}
          onChanged={refresh}
        />
      )}
    </main>
  );
}
