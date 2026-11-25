import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { EnvironmentVariables } from './config/env.validation';

// Configuración HTTP común a main.ts y a las pruebas e2e, para que lo que se prueba sea lo mismo que corre.
export function configureApp(app: INestApplication): void {
    const config = app.get(ConfigService<EnvironmentVariables, true>);

    // Detrás de un proxy, la IP de la persona llega en X-Forwarded-For. Con 0 se ignora: cualquiera podría inventarla.
    const hops = config.get('TRUST_PROXY_HOPS', { infer: true });
    if (hops > 0) app.getHttpAdapter().getInstance().set('trust proxy', hops);

    // Swagger UI usa scripts y estilos en línea: la política de contenido los permite solo para eso.
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:'],
            },
        },
    }));

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    app.enableCors({ origin: config.get('CORS_ORIGINS', { infer: true }) });
}
