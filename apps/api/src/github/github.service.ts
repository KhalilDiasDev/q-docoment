import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';

/**
 * Camada que fala com a API REST do GitHub (não confundir com git-ops,
 * que executa comandos Git reais no clone local).
 *
 * Usada para operações que fazem mais sentido via API (ex: criar releases,
 * abrir PRs no roadmap opcional da Fase 6) em vez de via `simple-git`.
 */
@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private octokit: Octokit;

  constructor(private config: ConfigService) {
    const token = this.config.get<string>('GITHUB_TOKEN');
    this.octokit = new Octokit({ auth: token });
  }

  private parseRepo(): { owner: string; repo: string } {
    const url = this.config.get<string>('GITHUB_REPO_URL') ?? '';
    const match = url.match(/github\.com\/([^/]+)\/([^/.]+)/);
    if (!match) {
      throw new Error('GITHUB_REPO_URL inválida ou não configurada');
    }
    return { owner: match[1], repo: match[2] };
  }

  async getRepoInfo() {
    const { owner, repo } = this.parseRepo();
    const { data } = await this.octokit.repos.get({ owner, repo });
    return data;
  }

  async createRelease(tagName: string, name: string, body: string) {
    const { owner, repo } = this.parseRepo();
    const { data } = await this.octokit.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      name,
      body,
    });
    return data;
  }
}
