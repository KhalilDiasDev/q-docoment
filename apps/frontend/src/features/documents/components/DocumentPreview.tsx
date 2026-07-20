import type { Document } from '@doc-versioning/types';

interface Props {
  document: Document;
}

/**
 * Placeholder de preview — implementação completa (PDF/imagem/vídeo)
 * é escopo da Fase 5 do roadmap (ver seção 11 da spec).
 */
export function DocumentPreview({ document }: Props) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
      Preview de {document.category} ainda não implementado (Fase 5).
      <br />
      Arquivo: {document.filePath}
    </div>
  );
}
