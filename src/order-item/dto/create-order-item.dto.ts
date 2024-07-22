import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;
  @IsNotEmpty()
  @IsInt()
  orderId: number;
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
