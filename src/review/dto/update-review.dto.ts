import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  userId?: number;
  @IsOptional()
  @IsNumber()
  rating?: number;
  @IsOptional()
  @IsString()
  comment?: string;
}
