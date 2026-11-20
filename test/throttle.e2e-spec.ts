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
});
