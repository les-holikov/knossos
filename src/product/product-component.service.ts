import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductComponent } from './product-component.entity';
import { Product } from './product.entity';
import { Component } from '../component/component.entity';
import { CreateProductComponentDto } from './dto/create-product-component.dto';

@Injectable()
export class ProductComponentService {
  constructor(
    @InjectRepository(ProductComponent)
    private productComponentRepository: Repository<ProductComponent>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
  ) {}

  async create(dto: CreateProductComponentDto) {
    const product = await this.productRepository.findOneBy({ id: dto.productId });
    if (!product) {
      throw new NotFoundException(`Product with id ${dto.productId} not found`);
    }

    const component = await this.componentRepository.findOneBy({ id: dto.componentId });
    if (!component) {
      throw new NotFoundException(`Component with id ${dto.componentId} not found`);
    }

    const existingLink = await this.productComponentRepository.findOne({
      where: {
        product: { id: dto.productId },
        component: { id: dto.componentId },
      },
    });

    if (existingLink) {
      existingLink.quantity = dto.quantity;
      return this.productComponentRepository.save(existingLink);
    }

    const productComponent = this.productComponentRepository.create({
      product,
      component,
      quantity: dto.quantity,
    });

    return this.productComponentRepository.save(productComponent);
  }

  findAll() {
    return this.productComponentRepository.find({
      relations: { product: true, component: true },
    });
  }

  findAllByProduct(productId: number) {
    return this.productComponentRepository.find({
      where: { product: { id: productId } },
      relations: { component: true },
    });
  }

  async remove(id: number) {
    const link = await this.productComponentRepository.findOneBy({ id });
    if (!link) {
      throw new NotFoundException(`ProductComponent with id ${id} not found`);
    }
    return this.productComponentRepository.remove(link);
  }
}
