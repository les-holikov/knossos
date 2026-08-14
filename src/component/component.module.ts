import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { Component } from './component.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Component])],
  providers: [ComponentService],
  controllers: [ComponentController],
})
export class ComponentModule {}
