import { IsString, IsNumber, Min } from 'class-validator';

export class CreateComponentDto {
  @IsString()
  name!: string;

  @IsString()
  warehouseCode!: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsNumber()
  @Min(0)
  price!: number;
}
