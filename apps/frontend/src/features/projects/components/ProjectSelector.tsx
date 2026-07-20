import type { Project } from '@doc-versioning/types';

interface Props {
  projects: Project[];
  value: string;
  onChange: (projectId: string) => void;
}

export function ProjectSelector({ projects, value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
    >
      <option value="">Todos os projetos</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
