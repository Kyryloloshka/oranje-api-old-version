import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  getAll() {
    return this.prisma.category.findMany();
  }
  getById(id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }
  getProducts(categoryId: number) {
    return this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        products: true,
      },
    });
  }
  async createCategory(dto: CreateCategoryDto) {
    const createdCategory = await this.prisma.category.create({
      data: dto,
    });
    return createdCategory;
  }
  delete(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
  update(id: number, dto: CreateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: { ...dto },
    });
  }
}
