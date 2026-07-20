/**
 * Converte um nome amigável em kebab-case, sem acento, sem espaço —
 * seguindo a convenção de nomenclatura de arquivos do repositório (seção 6.2).
 */
export default function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
