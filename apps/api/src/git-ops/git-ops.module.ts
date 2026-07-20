import { Module } from '@nestjs/common';
import { GitOpsService } from './git-ops.service';

@Module({
  providers: [GitOpsService],
  exports: [GitOpsService],
})
export class GitOpsModule {}
