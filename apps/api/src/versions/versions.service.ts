import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GitOpsService } from '../git-ops/git-ops.service';
import slugify from '../documents/slugify';

@Injectable()
export class VersionsService {
  constructor(
    private prisma: PrismaService,
    private gitOps: GitOpsService,
  ) {}

  async findAllForDocument(documentId: string) {
    await this.getDocumentOrThrow(documentId);
    return this.prisma.version.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getDocumentOrThrow(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!document) throw new NotFoundException('Documento não encontrado');
    return document;
  }

  private async getVersionOrThrow(documentId: string, versionId: string) {
    const version = await this.prisma.version.findFirst({
      where: { id: versionId, documentId },
    });
    if (!version) throw new NotFoundException('Versão não encontrada');
    return version;
  }

  /**
   * Restaura o conteúdo de uma versão anterior: checkout do commit antigo
   * para o caminho do arquivo, novo commit de "restauração", nova Version.
   */
  async restore(documentId: string, versionId: string, authorName: string) {
    const document = await this.getDocumentOrThrow(documentId);
    const version = await this.getVersionOrThrow(documentId, versionId);

    const { commitSha } = await this.gitOps.restoreFile({
      relativePath: document.filePath,
      commitSha: version.commitSha,
      authorName,
    });

    return this.prisma.version.create({
      data: {
        documentId,
        commitSha,
        message: `restore: volta ${document.fileName} para a versão ${version.commitSha.slice(0, 7)}`,
        authorName,
      },
    });
  }

  /**
   * Marca uma versão como aprovada/final: cria e envia a tag Git
   * `doc-{slug}-v{major}.{minor}` e atualiza o status do Documento.
   */
  async approve(
    documentId: string,
    versionId: string,
    version_: { major: number; minor: number },
  ) {
    const document = await this.getDocumentOrThrow(documentId);
    const version = await this.getVersionOrThrow(documentId, versionId);

    const documentSlug = slugify(document.fileName);
    const tagName = `doc-${documentSlug}-v${version_.major}.${version_.minor}`;

    await this.gitOps.createTag({
      tagName,
      commitSha: version.commitSha,
      message: `Aprova ${document.fileName} (${tagName})`,
    });

    await this.prisma.version.update({
      where: { id: versionId },
      data: { tag: tagName },
    });

    return this.prisma.document.update({
      where: { id: documentId },
      data: { status: 'APROVADO' },
      include: { versions: true },
    });
  }
}
