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
      console.log('Creating tag with data:', dto);
      const createdTag = await this.prisma.tag.create({
        data: {
          ...dto,
        },
      });
      console.log('Tag created successfully:', createdTag);
      return createdTag;
    } catch (error) {
      console.error('Error creating tag:', error);
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
