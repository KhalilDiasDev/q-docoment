import { IsEnum, IsString, IsUUID } from 'class-validator';
import { DocumentCategory } from '@prisma/client';

export class CreateDocumentDto {
  @IsUUID()
  projectId: string;

  @IsString()
  fileName: string;

  @IsEnum(DocumentCategory)
  category: DocumentCategory;
}
