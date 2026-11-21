import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, uniqueEmail } from './setup/helpers';

// Sin reemplazar ThrottlerGuard: el límite real de /auth es de 5 intentos por minuto y por IP.
describe('Límite de intentos en /auth (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createTestApp({ throttle: true });
    });
    afterAll(() => app.close());

    it('el sexto intento de ingreso en un minuto responde 429', async () => {
        const http = request(app.getHttpServer());
        const attempt = () => http.post('/auth/login').send({ email: uniqueEmail('intento'), password: 'Clave-segura-2026' });
        for (let i = 0; i < 5; i++) {
            expect((await attempt()).status).toBe(401);
        }
        expect((await attempt()).status).toBe(429);
    });

    it('el cuarto envío del formulario de empresas en una hora responde 429 (3.9b)', async () => {
        const http = request(app.getHttpServer());
        // Cuerpo inválido a propósito: el límite cuenta antes de validar, así no se guarda nada.
        const attempt = () => http.post('/company-requests').send({});
        for (let i = 0; i < 3; i++) {
            expect((await attempt()).status).toBe(400);
        }
        expect((await attempt()).status).toBe(429);
    });
});
