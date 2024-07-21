import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}
