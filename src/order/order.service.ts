import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.order.findMany();
  }

  getById(id: number) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  create(userId: number) {
    return this.prisma.order.create({
      data: {
        userId,
      },
    });
  }

  delete(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}
