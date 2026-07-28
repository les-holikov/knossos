import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheOptionsFactory, CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Injectable()
export class RedisConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    return {
      store: await redisStore({
        host: this.configService.get<string>('redis.host'),
        port: this.configService.get<number>('redis.port'),
      }),
      ttl: 60 * 1000,
    };
  }
}
