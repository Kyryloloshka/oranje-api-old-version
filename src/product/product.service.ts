import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EditProductDto } from './dto/edit-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const createdProduct = await this.prisma.product.create({
      data: dto,
    });
    return createdProduct;
  }

  async editProduct(id: number, dto: EditProductDto): Promise<Product> {
    try {
      const editedProduct = await this.prisma.product.update({
        where: { id },
        data: { ...dto },
      });
      if (!editedProduct) {
        throw new NotFoundException('Product not found');
      }
      return editedProduct;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid data provided');
        } else if (error.code === 'P2002') {
          throw new ForbiddenException('User with this id does not exist');
        } else {
          throw new UnauthorizedException(
            'User is not authenticated or token is invalid',
          );
        }
      } else {
        throw new UnauthorizedException(
          'User is not authenticated or token is invalid',
        );
      }
    }
  }

  async deleteProduct(id: number): Promise<void> {
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
