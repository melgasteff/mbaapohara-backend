import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// CORS_ORIGINS: lista de orígenes separados por comas. Es obligatoria: sin ella la API no arranca,
// para no quedar abierta a cualquier origen por omisión. En la tarea 1.2 pasa a @nestjs/config.
function getCorsOrigins(): string[] {
  const origins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);

  if (origins.length === 0) {
    throw new Error('Falta la variable de entorno CORS_ORIGINS (orígenes separados por comas)');
  }
  return origins;
}

async function bootstrap() {
  const corsOrigins = getCorsOrigins();
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  app.enableCors({ origin: corsOrigins })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
