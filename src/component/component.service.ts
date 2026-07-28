import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './component.entity';
import { CreateComponentDto } from './dto/create-component.dto';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(dto: CreateComponentDto) {
    const component = this.componentRepository.create(dto);
    const saved = await this.componentRepository.save(component);
    await this.cacheManager.del('components:all');
    return saved;
  }

  async findAll() {
    const cached = await this.cacheManager.get('components:all');
    if (cached) {
      return cached;
    }
    const components = await this.componentRepository.find();
    await this.cacheManager.set('components:all', components);
    return components;
  }

  async findOne(id: number) {
    const cacheKey = `component:${id}`;
    const cached = await this.cacheManager.get<Component>(cacheKey);
    if (cached) {
      return cached;
    }
    const component = await this.componentRepository.findOneBy({ id });
    if (!component) {
      throw new NotFoundException(`Component with id ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, component);
    return component;
  }

  async update(id: number, dto: Partial<CreateComponentDto>) {
    const component = await this.findOne(id);
    Object.assign(component, dto);
    const saved = await this.componentRepository.save(component);
    await this.cacheManager.del('components:all');
    await this.cacheManager.del(`component:${id}`);
    return saved;
  }

  async remove(id: number) {
    const component = await this.findOne(id);
    const result = await this.componentRepository.remove(component);
    await this.cacheManager.del('components:all');
    await this.cacheManager.del(`component:${id}`);
    return result;
  }
}
