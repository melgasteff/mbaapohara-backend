import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Con un proxy de confianza (4.4) el límite de intentos se cuenta por persona y no por proxy.
describe('Límite de intentos detrás de un proxy (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        // ConfigModule lee el entorno al importar AppModule: la variable va antes, y los módulos se importan después.
        process.env.TRUST_PROXY_HOPS = '1';
        const { createTestApp } = await import('./setup/helpers');
        app = await createTestApp({ throttle: true });
    });
    afterAll(async () => {
        delete process.env.TRUST_PROXY_HOPS;
        await app.close();
    });

    const attempt = (forwardedFor: string) => request(app.getHttpServer())
        .post('/auth/login').set('X-Forwarded-For', forwardedFor)
        .send({ email: 'nadie@ejemplo.com', password: 'Clave-segura-2026' });

    it('personas con distinta IP no comparten el límite', async () => {
        for (let i = 1; i <= 8; i++) {
            expect((await attempt(`203.0.113.${i}`)).status).toBe(401);
        }
    });

    it('la misma IP sigue limitada a 5 intentos por minuto', async () => {
        for (let i = 0; i < 5; i++) {
            expect((await attempt('198.51.100.7')).status).toBe(401);
        }
        expect((await attempt('198.51.100.7')).status).toBe(429);
    });

    it('inventar direcciones en X-Forwarded-For no evita el límite', async () => {
        // El proxy agrega la IP real al final: lo que mandó el cliente queda a la izquierda y no cuenta.
        for (let i = 0; i < 5; i++) {
            expect((await attempt(`192.0.2.${i}, 198.51.100.8`)).status).toBe(401);
        }
        expect((await attempt('192.0.2.99, 198.51.100.8')).status).toBe(429);
    });
});
