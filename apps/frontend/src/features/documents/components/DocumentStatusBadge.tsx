import type { DocumentStatus } from '@doc-versioning/types';

const STYLES: Record<DocumentStatus, string> = {
  RASCUNHO: 'bg-slate-100 text-slate-700',
  REVISAO: 'bg-amber-100 text-amber-800',
  FINAL: 'bg-blue-100 text-blue-800',
  APROVADO: 'bg-emerald-100 text-emerald-800',
};

const LABELS: Record<DocumentStatus, string> = {
  RASCUNHO: 'Rascunho',
  REVISAO: 'Em revisão',
  FINAL: 'Final',
  APROVADO: 'Aprovado',
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
