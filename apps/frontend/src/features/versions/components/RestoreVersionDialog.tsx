interface Props {
  versionLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmação explícita antes de restaurar — restaurar cria um novo commit
 * (não é destrutivo), mas ainda assim merece uma confirmação clara.
 */
export function RestoreVersionDialog({ versionLabel, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          Restaurar esta versão?
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          O conteúdo de <strong>{versionLabel}</strong> será restaurado como uma
          nova versão. O histórico atual não será perdido.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800"
          >
            Restaurar
          </button>
        </div>
      </div>
    </div>
  );
}
