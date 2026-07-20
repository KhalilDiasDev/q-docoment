import { IsInt, Min } from 'class-validator';

export class ApproveVersionDto {
  @IsInt()
  @Min(0)
  major: number;

  @IsInt()
  @Min(0)
  minor: number;
}
