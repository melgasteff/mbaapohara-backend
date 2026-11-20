import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateAdminUseCase } from 'src/auth/application/use-case/create-admin.use-case';
import { configureApp } from 'src/shared/infrastructure/app-setup';

export const PASSWORD = 'Clave-segura-2026';

/**
 * Levanta la API completa (AppModule) con la misma configuración HTTP que main.ts.
 * Por defecto desactiva el límite de intentos de /auth; la suite throttle.e2e-spec.ts lo prueba aparte.
 */
export async function createTestApp(options: { throttle?: boolean } = {}): Promise<INestApplication> {
    let builder = Test.createTestingModule({ imports: [AppModule] });
    if (!options.throttle) {
        builder = builder.overrideGuard(ThrottlerGuard).useValue({ canActivate: () => true });
    }
    const app = (await builder.compile()).createNestApplication();
    configureApp(app);
    await app.init();
    return app;
}

let sequence = 0;

/** Correo ficticio único dentro de la corrida (la base se vacía al empezar). */
export function uniqueEmail(prefix = 'persona'): string {
    return `${prefix}-${Date.now()}-${sequence++}@ejemplo.com`;
}

/** Sufijo único para nombres de empresas y locales (los nombres son únicos sin tildes ni mayúsculas). */
export function unique(text: string): string {
    return `${text} ${Date.now()}-${sequence++}`;
}

export async function register(app: INestApplication, email = uniqueEmail()): Promise<{ id: number; email: string }> {
    const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password: PASSWORD, aceptaTerminos: true })
        .expect(201);
    return response.body;
}

export async function login(app: INestApplication, email: string, password = PASSWORD): Promise<string> {
    const response = await request(app.getHttpServer()).post('/auth/login').send({ email, password }).expect(200);
    return response.body.accessToken;
}

/** Cuenta común con sesión iniciada. */
export async function userToken(app: INestApplication): Promise<{ id: number; email: string; token: string }> {
    const account = await register(app);
    return { ...account, token: await login(app, account.email) };
}

/** Administrador creado con el mismo caso de uso que `npm run admin:create`. */
export async function adminToken(app: INestApplication): Promise<string> {
    const email = uniqueEmail('admin');
    await app.get(CreateAdminUseCase).execute(email, PASSWORD);
    return login(app, email);
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
