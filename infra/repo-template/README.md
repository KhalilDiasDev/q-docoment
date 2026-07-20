# Template do repositório de destino

Este `.gitattributes` deve existir no repositório GitHub que a plataforma
versiona (`GITHUB_REPO_URL`), **não** no monorepo da aplicação.

Antes de apontar `GITHUB_REPO_URL` para um repositório, garanta que:

1. O repositório existe no GitHub.
2. Este `.gitattributes` foi commitado nele (configura Git LFS por tipo de
   arquivo — vídeos, apresentações e imagens).
3. Git LFS foi inicializado no repositório (`git lfs track` já feito via
   este arquivo, mas o repositório precisa ter ao menos um commit inicial).
4. O `GITHUB_TOKEN` usado pelo backend tem permissão de escrita (push) nesse
   repositório.
