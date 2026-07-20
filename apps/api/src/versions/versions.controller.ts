import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { VersionsService } from './versions.service';
import { ApproveVersionDto } from './dto/approve-version.dto';

@UseGuards(JwtAuthGuard)
@Controller('documents/:documentId/versions')
export class VersionsController {
  constructor(private versionsService: VersionsService) {}

  @Get()
  findAll(@Param('documentId') documentId: string) {
    return this.versionsService.findAllForDocument(documentId);
  }

  @Post(':versionId/restore')
  restore(
    @Param('documentId') documentId: string,
    @Param('versionId') versionId: string,
    @Req() req: any,
  ) {
    return this.versionsService.restore(documentId, versionId, req.user.email);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post(':versionId/approve')
  approve(
    @Param('documentId') documentId: string,
    @Param('versionId') versionId: string,
    @Body() dto: ApproveVersionDto,
  ) {
    return this.versionsService.approve(documentId, versionId, dto);
  }
}
