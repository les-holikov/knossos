import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { ProductComponentService } from './product-component.service';
import { CreateProductComponentDto } from './dto/create-product-component.dto';

@Controller('product-components')
export class ProductComponentController {
  constructor(private readonly productComponentService: ProductComponentService) {}

  @Post()
  create(@Body() dto: CreateProductComponentDto) {
    return this.productComponentService.create(dto);
  }

  @Get()
  findAll() {
    return this.productComponentService.findAll();
  }

  @Get('product/:productId')
  findAllByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productComponentService.findAllByProduct(productId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productComponentService.remove(id);
  }
}
