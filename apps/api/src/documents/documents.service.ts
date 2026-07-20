import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from './slugify';
import { PrismaService } from '../prisma/prisma.service';
import { GitOpsService } from '../git-ops/git-ops.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';

const CATEGORY_FOLDER: Record<string, string> = {
  PDF: 'relatorios',
  PPTX: 'apresentacoes',
  VIDEO: 'videos',
  IMAGE: 'imagens',
};

const CATEGORY_COMMIT_TYPE: Record<string, string> = {
  PDF: 'docs',
  PPTX: 'slides',
  VIDEO: 'media',
  IMAGE: 'design',
};

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private gitOps: GitOpsService,
  ) {}

  async findAll(query: QueryDocumentsDto) {
    return this.prisma.document.findMany({
      where: {
        projectId: query.projectId,
        category: query.category,
        status: query.status,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { versions: { orderBy: { createdAt: 'desc' } } },
    });
    if (!document) throw new NotFoundException('Documento não encontrado');
    return document;
  }

  async create(
    dto: CreateDocumentDto,
    file: { buffer: Buffer; originalname: string },
    authorName: string,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');

    const ext = file.originalname.split('.').pop();
    const documentSlug = slugify(dto.fileName);
    const folder = CATEGORY_FOLDER[dto.category];
    const relativePath = `documentos/${folder}/${project.slug}/${documentSlug}.${ext}`;
    const commitType = CATEGORY_COMMIT_TYPE[dto.category];

    const { commitSha } = await this.gitOps.commitFile({
      relativePath,
      content: file.buffer,
      message: `${commitType}(${documentSlug}): adiciona novo documento -> v1.0`,
      authorName,
    });

    return this.prisma.document.create({
      data: {
        projectId: dto.projectId,
        fileName: dto.fileName,
        filePath: relativePath,
        category: dto.category,
        createdBy: authorName,
        versions: {
          create: {
            commitSha,
            message: `${commitType}(${documentSlug}): adiciona novo documento -> v1.0`,
            authorName,
          },
        },
      },
      include: { versions: true },
    });
  }

  async addVersion(
    id: string,
    file: { buffer: Buffer; originalname: string },
    authorName: string,
    message?: string,
  ) {
    const document = await this.findOne(id);
    const documentSlug = slugify(document.fileName);
    const commitType = CATEGORY_COMMIT_TYPE[document.category];
    const commitMessage =
      message ?? `${commitType}(${documentSlug}): atualiza documento`;

    const { commitSha } = await this.gitOps.commitFile({
      relativePath: document.filePath,
      content: file.buffer,
      message: commitMessage,
      authorName,
    });

    await this.prisma.version.create({
      data: {
        documentId: id,
        commitSha,
        message: commitMessage,
        authorName,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.document.delete({ where: { id } });
  }
}
