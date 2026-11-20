// Variables de entorno de las pruebas e2e: .env.test gana sobre .env y sobre el entorno.
// Se carga en cada archivo de prueba (setupFiles) y en global-setup.ts.
import { config } from 'dotenv';

config({ path: '.env.test', override: true });

const database = process.env.DB_NAME ?? '';
if (!database.endsWith('_test')) {
    // Nunca correr contra la base de desarrollo: global-setup borra el esquema completo.
    throw new Error(`Las pruebas e2e necesitan una base cuyo nombre termine en «_test» (DB_NAME=«${database}»). Ver .env.test.example`);
}
