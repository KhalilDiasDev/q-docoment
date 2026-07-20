import {
  Injectable,
  Logger,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import simpleGit, { SimpleGit } from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
import { Mutex } from './mutex';

export interface CommitResult {
  commitSha: string;
}

@Injectable()
export class GitOpsService implements OnModuleInit {
  private readonly logger = new Logger(GitOpsService.name);
  private git: SimpleGit;
  private repoPath: string;
  private repoUrl: string;
  private mutex = new Mutex();
  private ready = false;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    this.repoPath = this.config.get<string>('GIT_REPO_PATH') ?? '/app/repo';
    this.repoUrl = this.config.get<string>('GITHUB_REPO_URL') ?? '';

    if (!this.repoUrl) {
      this.logger.warn(
        'GITHUB_REPO_URL não configurado — git-ops ficará inativo até ser definido.',
      );
      return;
    }

    await this.mutex.runExclusive(() => this.ensureRepoCloned());
  }

  /**
   * Clona o repositório no boot, ou reaproveita o clone existente no volume.
   * Protegido por mutex para evitar clones concorrentes.
   */
  private async ensureRepoCloned() {
    const authenticatedUrl = this.withToken(this.repoUrl);

    const gitDirExists = fs.existsSync(path.join(this.repoPath, '.git'));

    if (!gitDirExists) {
      this.logger.log(`Clonando repositório em ${this.repoPath}...`);
      fs.mkdirSync(this.repoPath, { recursive: true });
      const bootstrapGit = simpleGit();
      await bootstrapGit.clone(authenticatedUrl, this.repoPath);
    } else {
      this.logger.log('Repositório já clonado, reaproveitando volume.');
    }

    this.git = simpleGit(this.repoPath);
    await this.git.addConfig('user.name', 'doc-versioning-bot');
    await this.git.addConfig('user.email', 'bot@doc-versioning.local');

    try {
      await this.git.pull();
    } catch (err) {
      this.logger.warn(`git pull falhou no boot: ${(err as Error).message}`);
    }

    this.ready = true;
  }

  private withToken(url: string): string {
    const token = this.config.get<string>('GITHUB_TOKEN');
    if (!token) return url;
    // https://x-access-token:<TOKEN>@github.com/org/repo.git
    return url.replace('https://', `https://x-access-token:${token}@`);
  }

  private assertReady() {
    if (!this.ready) {
      throw new InternalServerErrorException(
        'git-ops não está pronto (repositório não clonado ou GITHUB_REPO_URL ausente)',
      );
    }
  }

  absolutePath(relativePath: string): string {
    return path.join(this.repoPath, relativePath);
  }

  /**
   * Escreve um arquivo no repositório clonado, commita e faz push.
   * Toda a operação é serializada via mutex.
   */
  async commitFile(params: {
    relativePath: string;
    content: Buffer;
    message: string;
    authorName: string;
  }): Promise<CommitResult> {
    this.assertReady();

    return this.mutex.runExclusive(async () => {
      const fullPath = this.absolutePath(params.relativePath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, params.content);

      await this.git.add(params.relativePath);
      const commitSummary = await this.git.commit(params.message, undefined, {
        '--author': `${params.authorName} <bot@doc-versioning.local>`,
      });
      await this.git.push();

      return { commitSha: commitSummary.commit };
    });
  }

  /**
   * Restaura um arquivo para o conteúdo de um commit anterior,
   * cria um novo commit de "restauração" e faz push.
   */
  async restoreFile(params: {
    relativePath: string;
    commitSha: string;
    authorName: string;
  }): Promise<CommitResult> {
    this.assertReady();

    return this.mutex.runExclusive(async () => {
      await this.git.raw([
        'checkout',
        params.commitSha,
        '--',
        params.relativePath,
      ]);
      await this.git.add(params.relativePath);
      const message = `restore(${params.relativePath}): restaura versão ${params.commitSha.slice(0, 7)}`;
      const commitSummary = await this.git.commit(message, undefined, {
        '--author': `${params.authorName} <bot@doc-versioning.local>`,
      });
      await this.git.push();

      return { commitSha: commitSummary.commit };
    });
  }

  /**
   * Cria e envia uma tag de versão oficial.
   */
  async createTag(params: {
    tagName: string;
    commitSha?: string;
    message: string;
  }): Promise<void> {
    this.assertReady();

    await this.mutex.runExclusive(async () => {
      const target = params.commitSha ?? 'HEAD';
      await this.git.tag(['-a', params.tagName, target, '-m', params.message]);
      await this.git.pushTags();
    });
  }

  async fileHistory(relativePath: string) {
    this.assertReady();
    const log = await this.git.log({ file: relativePath });
    return log.all;
  }
}
