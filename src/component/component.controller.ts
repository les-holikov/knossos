import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  create(@Body() dto: CreateComponentDto) {
    return this.componentService.create(dto);
  }

  @Get()
  findAll() {
    return this.componentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.componentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateComponentDto>) {
    return this.componentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.componentService.remove(id);
  }
}
