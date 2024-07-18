import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get()
  async getAll() {
    return await this.tagService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id) {
    return await this.tagService.getById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateTagDto) {
    return await this.tagService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async edit(@Param('id') id, @Body() dto: UpdateTagDto) {
    return await this.tagService.edit(id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id') id) {
    return await this.tagService.delete(id);
  }
}
