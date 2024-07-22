import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemDto } from './dto';

@Injectable()
export class OrderItemService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.orderItem.findMany();
  }

  getById(id: number) {
    return this.prisma.orderItem.findUnique({
      where: {
        id,
      },
    });
  }

  create(dto: CreateOrderItemDto) {
    return this.prisma.orderItem.create({
      data: {
        ...dto,
      },
    });
  }

  delete(id: number) {
    return this.prisma.orderItem.delete({
      where: {
        id,
      },
    });
  }

  edit(id: number, dto: any) {
    console.log(dto);

    return this.prisma.orderItem.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  editQuantity(id: number, quantity: number) {
    return this.prisma.orderItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
    });
  }
}
