import { Module } from '@nestjs/common';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';

@Module({
  controllers: [OrderItemController],
  providers: [OrderItemService]
})
export class OrderItemModule {}
