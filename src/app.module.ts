import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import configuration from './config/configuration';
import { TypeOrmConfigService } from './config/typeorm.config';
import { RedisConfigService } from './config/redis.config';
import { ProductModule } from './product/product.module';
import { ComponentModule } from './component/component.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: RedisConfigService,
    }),
    ProductModule,
    ComponentModule,
  ],
})
export class AppModule {}
