import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, EditProductDto } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async editProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: EditProductDto,
  ) {
    return await this.productService.editProduct(id, productData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProduct(id);
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }
}
