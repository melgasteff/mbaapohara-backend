// Antes de todas las suites: crea la base de pruebas si no existe, la vacía y aplica las migraciones
// (que traen los datos de referencia: INE, CIIU, contratos, modalidades y cargos). No carga la semilla de
// demostración: cada prueba crea sus propios datos.
import './env';
import { execSync } from 'child_process';
import { Client } from 'pg';

function connection(database: string) {
    return new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database,
    });
}

export default async function globalSetup(): Promise<void> {
    const database = process.env.DB_NAME!;

    const server = connection('postgres');
    await server.connect();
    try {
        const { rowCount } = await server.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
        // El nombre ya se validó en env.ts (termina en _test); se cita como identificador.
        if (!rowCount) await server.query(`CREATE DATABASE "${database.replace(/"/g, '""')}"`);
    } finally {
        await server.end();
    }

    const db = connection(database);
    await db.connect();
    try {
        await db.query('DROP SCHEMA IF EXISTS public CASCADE');
        await db.query('CREATE SCHEMA public');
    } finally {
        await db.end();
    }

    // Las mismas migraciones que en desarrollo; data-source.ts no pisa las variables ya cargadas.
    execSync('npm run -s migration:run', { stdio: 'pipe', env: process.env });
}
