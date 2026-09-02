import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  private readonly sslCertPath = path.join(__dirname, '..', 'certs', 'global-bundle.pem');

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('db.postgres.host'),
      port: this.configService.get<number>('db.postgres.port'),
      username: this.configService.get<string>('db.postgres.username'),
      password: this.configService.get<string>('db.postgres.password'),
      database: this.configService.get<string>('db.postgres.database'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      ssl: {
        ca: fs.readFileSync(this.sslCertPath).toString(),
        rejectUnauthorized: true,
      },};
  }
}
