import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prismaa: PrismaService) {}

  getAll() {
    return this.prismaa.cart.findMany();
  }

  getById(id: number) {
    return this.prismaa.cart.findUnique({ where: { id } });
  }

  create(userId: number) {
    return this.prismaa.cart.create({
      data: {
        userId,
      },
    });
  }

  delete(id: number) {
    return this.prismaa.cart.delete({ where: { id } });
  }
}
