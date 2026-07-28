import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    const saved = await this.productRepository.save(product);
    await this.cacheManager.del('products:all');
    return saved;
  }

  async findAll() {
    const cached = await this.cacheManager.get('products:all');
    if (cached) {
      return cached;
    }
    const products = await this.productRepository.find();
    await this.cacheManager.set('products:all', products);
    return products;
  }

  async findOne(id: number) {
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) {
      return cached;
    }
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, product);
    return product;
  }

  async update(id: number, dto: Partial<CreateProductDto>) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    const saved = await this.productRepository.save(product);
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return saved;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const result = await this.productRepository.remove(product);
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return result;
  }
}
