import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('http.port');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port || 2999);
}

void bootstrap();
