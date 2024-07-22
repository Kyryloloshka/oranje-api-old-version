import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
