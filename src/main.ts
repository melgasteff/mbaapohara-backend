import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './cities/infrastructure/exception-filter/exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
  // Mostrar rutas registradas
const router = app.getHttpAdapter().getInstance();
const routes = [];

router._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // ruta directa
    const method = Object.keys(middleware.route.methods)[0].toUpperCase();
    routes.push(`${method} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    // rutas anidadas
    middleware.handle.stack.forEach((handler) => {
      const route = handler.route;
      if (route) {
        const method = Object.keys(route.methods)[0].toUpperCase();
        routes.push(`${method} ${route.path}`);
      }
    });
  }
});
}
bootstrap();
