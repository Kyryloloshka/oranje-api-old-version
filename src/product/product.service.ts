import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto';
import { EditProductDto } from './dto/edit-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const createdProduct = await this.prisma.product.create({
      data: dto,
    });
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category with this id does not exist');
      }
    }
    return createdProduct;
  }

  async editProduct(id: number, dto: EditProductDto): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category with this id does not exist');
      }
    }
    return await this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async deleteProduct(id: number) {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  getAllProducts() {
    return this.prisma.product.findMany();
  }
}
