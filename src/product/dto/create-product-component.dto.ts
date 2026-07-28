import { IsInt, Min } from 'class-validator';

export class CreateProductComponentDto {
  @IsInt()
  productId!: number;

  @IsInt()
  componentId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
