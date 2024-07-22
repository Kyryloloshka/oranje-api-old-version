import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  getAll() {
    return this.prisma.tag.findMany({
      include: {
        products: true,
      },
    });
  }

  async getById(id: number) {
    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async create(dto: CreateTagDto) {
    try {
      const createdTag = await this.prisma.tag.create({
        data: {
          ...dto,
        },
      });
      return createdTag;
    } catch (error) {
      throw new InternalServerErrorException('Error creating tag');
    }
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
