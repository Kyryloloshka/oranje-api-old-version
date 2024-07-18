import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateReviewDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  getAll() {
    return this.prisma.review.findMany();
  }

  async getById(id: number) {
    return this.prisma.review.findUnique({
      where: {
        id,
      },
    });
  }

  // async create(userId: number, dto: CreateReviewDto) {
  //   return this.prisma.review.create({
  //     data: {
  //       userId: userId,
  //       ...dto,
  //     },
  //   });
  // }

  async edit(id: number, dto: UpdateReviewDto) {
    return await this.prisma.review.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
