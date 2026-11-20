import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './shared/infrastructure/app-setup';
import { EnvironmentVariables } from './shared/infrastructure/config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  configureApp(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mbaapohara API')
    .setDescription('Reseñas laborales anónimas y moderadas sobre empresas de Paraguay')
    .setVersion('0.1')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(config.get('PORT', { infer: true }));
}
bootstrap();
