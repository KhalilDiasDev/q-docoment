# Doc Versioning Platform

Plataforma interna de versionamento de documentos (PDF, PPTX, vídeos, imagens)
usando Git/GitHub como motor de versionamento, com interface visual própria.

Ver a spec completa em `SPEC.md` para decisões de arquitetura e roadmap.

## Status da implementação

Este scaffold cobre a **Fase 1 a 4** do roadmap:

- ✅ Monorepo (pnpm workspaces + Turborepo)
- ✅ Schema Prisma + módulo `auth` (JWT)
- ✅ Docker Compose (postgres + api + frontend)
- ✅ `git-ops`: clone no boot, commit/push/checkout/tag serializados via mutex
- ✅ `documents`: upload, listagem, nova versão (multipart)
- ✅ `versions`: histórico, restore, approve (tags)
- ✅ Frontend: login, listagem de documentos, upload, histórico de versões
- ⬜ Fase 5 (preview de PDF/imagem/vídeo, filtros avançados) — `DocumentPreview.tsx` está stubado
- ⬜ Fase 6 (PRs colaborativos, permissões por projeto, notificações) — não iniciado

## Pré-requisitos

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Docker + Docker Compose
- Um repositório GitHub vazio (ou existente) para servir de destino do
  versionamento, com um Personal Access Token (ou GitHub App) com permissão
  de push

## Setup local (sem Docker, para desenvolvimento)

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp infra/.env.example apps/api/.env
# edite apps/api/.env com DATABASE_URL, GITHUB_TOKEN, GITHUB_REPO_URL, JWT_SECRET

# 3. Subir apenas o Postgres via Docker
docker compose -f infra/docker-compose.yml up -d postgres

# 4. Rodar migrations + seed (cria usuário admin@doc-versioning.local / admin123)
pnpm db:migrate
pnpm --filter api prisma:seed

# 5. Rodar tudo em modo dev
pnpm dev
```

Frontend em `http://localhost:3001` (ou porta padrão do Next se rodado via
`pnpm dev` direto), API em `http://localhost:3000`.

## Setup via Docker Compose (produção-like)

```bash
cd infra
cp .env.example .env
# edite .env com os valores reais (GITHUB_TOKEN, GITHUB_REPO_URL, etc.)
docker compose up --build
```

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000`

Antes de subir, garanta que o repositório de destino em `GITHUB_REPO_URL` já
tem o `.gitattributes` de `infra/repo-template/` commitado (configura Git
LFS para vídeos/imagens/apresentações).

## Login inicial

O seed cria:

```
email: admin@doc-versioning.local
senha: admin123
role: admin
```

Troque a senha ou crie novos usuários diretamente no banco — não há tela de
cadastro de usuário neste scaffold (equipe pequena, conforme decisão de
arquitetura #5 da spec).

## Notas de implementação

- **Serialização de escrita no Git**: `GitOpsService` usa um `Mutex` interno
  para garantir que `commit`/`push`/`checkout`/`tag` nunca corram em
  paralelo, mesmo com múltiplas requisições simultâneas — conforme exigido
  na seção 12 da spec.
- **Autenticação Git**: o `GITHUB_TOKEN` é injetado na URL de clone via
  `x-access-token`, nunca exposto ao frontend.
- **Sem token individual por usuário**: o backend usa um único token de
  serviço para todas as operações Git, independente de qual usuário da
  plataforma disparou a ação (o nome do usuário vai só na mensagem/autor do
  commit).
