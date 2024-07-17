import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  async getById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getProducts(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category.products;
  }

  async createCategory(dto: CreateCategoryDto) {
    const createdCategory = await this.prisma.category.create({
      data: {
        ...dto,
      },
    });
    return createdCategory;
  }

  async delete(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: { ...dto },
    });
  }
}
