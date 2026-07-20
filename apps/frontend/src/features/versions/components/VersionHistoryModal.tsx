import type { Document } from '@doc-versioning/types';
import { useVersions } from '../hooks/use-versions';
import { restoreVersion, approveVersion } from '../services/versions';

interface Props {
  document: Document;
  onClose: () => void;
  onChanged: () => void;
}

export function VersionHistoryModal({ document, onClose, onChanged }: Props) {
  const { versions, isLoading, refresh } = useVersions(document.id);

  async function handleRestore(versionId: string) {
    await restoreVersion(document.id, versionId);
    await refresh();
    onChanged();
  }

  async function handleApprove(versionId: string) {
    const major = Number(prompt('Versão major (ex: 1)', '1'));
    const minor = Number(prompt('Versão minor (ex: 0)', '0'));
    if (Number.isNaN(major) || Number.isNaN(minor)) return;
    await approveVersion(document.id, versionId, { major, minor });
    await refresh();
    onChanged();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Histórico — {document.fileName}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <p className="text-sm text-slate-500">Carregando...</p>
        )}

        <ul className="divide-y divide-slate-100">
          {versions.map((version) => (
            <li key={version.id} className="py-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {version.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {version.authorName} ·{' '}
                    {new Date(version.createdAt).toLocaleString('pt-BR')} ·{' '}
                    {version.commitSha.slice(0, 7)}
                    {version.tag && (
                      <span className="ml-2 text-emerald-700 font-medium">
                        {version.tag}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => handleRestore(version.id)}
                    className="text-xs text-slate-600 hover:text-slate-900 underline"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={() => handleApprove(version.id)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Aprovar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
