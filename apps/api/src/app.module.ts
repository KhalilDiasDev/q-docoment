import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { DocumentsModule } from './documents/documents.module';
import { VersionsModule } from './versions/versions.module';
import { GitOpsModule } from './git-ops/git-ops.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    DocumentsModule,
    VersionsModule,
    GitOpsModule,
    GithubModule,
  ],
})
export class AppModule {}
