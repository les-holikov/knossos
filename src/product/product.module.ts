import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductComponent } from './product-component.entity';
import { Component } from '../component/component.entity';
import { ProductComponentService } from './product-component.service';
import { ProductComponentController } from './product-component.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductComponent, Component])],
  controllers: [ProductController, ProductComponentController],
  providers: [ProductService, ProductComponentService],
  exports: [ProductService],
})
export class ProductModule {}
