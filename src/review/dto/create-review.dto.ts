import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  productId: number;
  @IsNotEmpty()
  @IsNumber()
  rating: number;
  @IsOptional()
  @IsString()
  comment?: string;
}
