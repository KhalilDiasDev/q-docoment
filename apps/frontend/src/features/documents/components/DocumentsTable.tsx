import type { Document } from '@doc-versioning/types';
import { DocumentStatusBadge } from './DocumentStatusBadge';

interface Props {
  documents: Document[];
  onOpenHistory: (document: Document) => void;
}

const CATEGORY_LABELS: Record<Document['category'], string> = {
  PDF: 'PDF',
  PPTX: 'Apresentação',
  VIDEO: 'Vídeo',
  IMAGE: 'Imagem',
};

export function DocumentsTable({ documents, onOpenHistory }: Props) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        Nenhum documento ainda. Envie o primeiro para começar o histórico.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-slate-500 border-b border-slate-200">
          <th className="py-2 font-medium">Nome</th>
          <th className="py-2 font-medium">Categoria</th>
          <th className="py-2 font-medium">Status</th>
          <th className="py-2 font-medium">Atualizado</th>
          <th className="py-2 font-medium"></th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id} className="border-b border-slate-100">
            <td className="py-3 font-medium text-slate-900">{doc.fileName}</td>
            <td className="py-3 text-slate-600">
              {CATEGORY_LABELS[doc.category]}
            </td>
            <td className="py-3">
              <DocumentStatusBadge status={doc.status} />
            </td>
            <td className="py-3 text-slate-500">
              {new Date(doc.updatedAt).toLocaleDateString('pt-BR')}
            </td>
            <td className="py-3 text-right">
              <button
                onClick={() => onOpenHistory(doc)}
                className="text-sm text-slate-600 hover:text-slate-900 underline"
              >
                Histórico
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
