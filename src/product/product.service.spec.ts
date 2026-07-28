import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: any;
  let cacheManager: any;

  const mockProduct: Product = {
    id: 1,
    name: 'desk lamp',
    warehouseCode: 'LAMP-001',
    quantity: 10,
    price: 25.99,
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
        ProductService,
        { provide: getRepositoryToken(Product), useValue: repository },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a product, then invalidate cache', async () => {
      const dto = { name: 'desk lamp', warehouseCode: 'LAMP-001', quantity: 10, price: 25.99 };
      repository.create.mockReturnValue(mockProduct);
      repository.save.mockResolvedValue(mockProduct);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockProduct);
      expect(cacheManager.del).toHaveBeenCalledWith('products:all');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return cached products if present', async () => {
      cacheManager.get.mockResolvedValue([mockProduct]);

      const result = await service.findAll();

      expect(result).toEqual([mockProduct]);
      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should query repository and cache result on cache miss', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.find.mockResolvedValue([mockProduct]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith('products:all', [mockProduct]);
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return cached product if present', async () => {
      cacheManager.get.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(result).toEqual(mockProduct);
      expect(repository.findOneBy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when product does not exist', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should query repository and cache result on cache miss', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(cacheManager.set).toHaveBeenCalledWith('product:1', mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update product, save it, and invalidate caches', async () => {
      cacheManager.get.mockResolvedValue(mockProduct);
      repository.save.mockResolvedValue({ ...mockProduct, name: 'updated lamp' });

      const dto = { name: 'updated lamp' };
      const result = await service.update(1, dto);

      expect(repository.save).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('products:all');
      expect(cacheManager.del).toHaveBeenCalledWith('product:1');
      expect(result.name).toBe('updated lamp');
    });
  });

  describe('remove', () => {
    it('should remove product and invalidate cache', async () => {
      cacheManager.get.mockResolvedValue(mockProduct);
      repository.remove.mockResolvedValue(mockProduct);

      const result = await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(mockProduct);
      expect(cacheManager.del).toHaveBeenCalledWith('products:all');
      expect(cacheManager.del).toHaveBeenCalledWith('product:1');
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product to remove does not exist', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
