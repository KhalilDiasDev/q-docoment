import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { DocumentCategory, DocumentStatus } from '@prisma/client';

export class QueryDocumentsDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsEnum(DocumentCategory)
  category?: DocumentCategory;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
}
