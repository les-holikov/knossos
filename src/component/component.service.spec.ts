import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { ComponentService } from './component.service';
import { Component } from './component.entity';
import { CreateComponentDto } from './dto/create-component.dto';

describe('ComponentService', () => {
  let service: ComponentService;
  let repository: any;
  let cacheManager: any;

  const mockComponent: Component = {
    id: 1,
    name: 'resistor',
    warehouseCode: '123545',
    quantity: 50,
    price: 0.1,
    productComponents: [],
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentService,
        { provide: getRepositoryToken(Component), useValue: repository },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<ComponentService>(ComponentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a component, then invalidate cache', async () => {
      const dto: CreateComponentDto = {
        name: 'resistor',
        warehouseCode: 'RES-100',
        quantity: 50,
        price: 0.1,
      };
      repository.create.mockReturnValue(mockComponent);
      repository.save.mockResolvedValue(mockComponent);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockComponent);
      expect(cacheManager.del).toHaveBeenCalledWith('components:all');
      expect(result).toEqual(mockComponent);
    });
  });

  describe('findAll', () => {
    it('should return cached components if present', async () => {
      cacheManager.get.mockResolvedValue([mockComponent]);

      const result = await service.findAll();

      expect(result).toEqual([mockComponent]);
      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should query repository and cache result on cache miss', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.find.mockResolvedValue([mockComponent]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith('components:all', [mockComponent]);
      expect(result).toEqual([mockComponent]);
    });
  });

  describe('findOne', () => {
    it('should return cached component if present', async () => {
      cacheManager.get.mockResolvedValue(mockComponent);

      const result = await service.findOne(1);

      expect(result).toEqual(mockComponent);
      expect(repository.findOneBy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when component does not exist', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should query repository and cache result on cache miss', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(mockComponent);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(cacheManager.set).toHaveBeenCalledWith('component:1', mockComponent);
      expect(result).toEqual(mockComponent);
    });
  });

  describe('update', () => {
    it('should update component, save it, and invalidate caches', async () => {
      cacheManager.get.mockResolvedValue(mockComponent);
      repository.save.mockResolvedValue({ ...mockComponent, name: 'updated resistor' });

      const dto = { name: 'updated resistor' };
      const result = await service.update(1, dto);

      expect(repository.save).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('components:all');
      expect(cacheManager.del).toHaveBeenCalledWith('component:1');
      expect(result.name).toBe('updated resistor');
    });
  });

  describe('remove', () => {
    it('should remove component and invalidate cache', async () => {
      cacheManager.get.mockResolvedValue(mockComponent);
      repository.remove.mockResolvedValue(mockComponent);

      const result = await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(mockComponent);
      expect(cacheManager.del).toHaveBeenCalledWith('components:all');
      expect(cacheManager.del).toHaveBeenCalledWith('component:1');
      expect(result).toEqual(mockComponent);
    });

    it('should throw NotFoundException if component to remove does not exist', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
