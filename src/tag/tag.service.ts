import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  getAll() {
    return this.prisma.tag.findMany();
  }

  async getById(id: number) {
    return this.prisma.tag.findUnique({
      where: {
        id,
      },
    });
  }

  async create(dto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        ...dto,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.tag.delete({
      where: {
        id,
      },
    });
  }

  async edit(id: number, dto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }
}
