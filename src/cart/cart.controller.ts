import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getAll() {
    return this.cartService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.cartService.getById(id);
  }

  @Post()
  create(@GetUser() user: User) {
    return this.cartService.create(user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.cartService.delete(id);
  }
}
