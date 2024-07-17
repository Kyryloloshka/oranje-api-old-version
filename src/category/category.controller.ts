import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.createCategory(dto);
  }

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getById(id);
  }

  @Get(':id/products')
  getProducts(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getProducts(categoryId);
  }

  @HttpCode(204)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.delete(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Body() dto: UpdateCategoryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.categoryService.update(id, dto);
  }
}
