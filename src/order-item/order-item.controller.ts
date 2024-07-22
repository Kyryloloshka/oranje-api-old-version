import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  getAll() {
    return this.orderItemService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.orderItemService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateOrderItemDto) {
    return this.orderItemService.create(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderItemService.delete(id);
  }

  @Put(':id')
  edit(@Param('id') id: number, @Body() dto: UpdateOrderItemDto) {
    return this.orderItemService.edit(id, dto);
  }

  @Put(':id/quantity')
  editQuantity(@Param('id') id: number, @Body('quantity') quantity: number) {
    return this.orderItemService.editQuantity(id, quantity);
  }
}
