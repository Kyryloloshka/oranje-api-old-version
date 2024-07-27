import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartItemService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.cartItem.findMany();
  }

  getById(id: number) {
    return this.prisma.cartItem.findUnique({ where: { id } });
  }

  create(data: CreateCartItemDto) {
    return this.prisma.cartItem.create({
      data,
    });
  }

  delete(id: number) {
    return this.prisma.cartItem.delete({ where: { id } });
  }

  update(id: number, data: UpdateCartItemDto) {
    return this.prisma.cartItem.update({
      where: { id },
      data,
    });
  }
}
