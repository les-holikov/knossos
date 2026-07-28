import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('db.postgres.host'),
      port: this.configService.get<number>('db.postgres.port'),
      username: this.configService.get<string>('db.postgres.username'),
      password: this.configService.get<string>('db.postgres.password'),
      database: this.configService.get<string>('db.postgres.database'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}
