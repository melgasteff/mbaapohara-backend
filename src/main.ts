import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   //UseGlobalPipes implementa las validaciones en todas las clases. Whitelist es para ignorar campos que no correspondan.
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
