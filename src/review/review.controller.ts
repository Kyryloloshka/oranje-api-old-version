import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtGuard } from 'src/auth/guard';
import { UpdateReviewDto } from './dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Get()
  getAll() {
    return this.reviewService.getAll();
  }
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getById(id);
  }

  // @Post()
  // @UseGuards(JwtGuard)
  // async create(@GetUser('id') userId, @Body() dto: CreateReviewDto) {
  //   return this.reviewService.create(userId, dto);
  // }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async edit(@Param('id') id, @Body() dto: UpdateReviewDto) {
    return this.reviewService.edit(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id) {
    return this.reviewService.delete(id);
  }
}
