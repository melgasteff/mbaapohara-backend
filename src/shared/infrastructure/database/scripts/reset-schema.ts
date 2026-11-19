// Borra todo el esquema public de la base configurada en .env (solo desarrollo).
//   npm run db:reset   (borra y después corre db:setup)
// Se niega a correr con NODE_ENV=production.
import dataSource from '../data-source';

async function main() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('db:reset no corre con NODE_ENV=production');
    }
    await dataSource.initialize();
    try {
        const database = dataSource.options.database;
        await dataSource.query('DROP SCHEMA public CASCADE');
        await dataSource.query('CREATE SCHEMA public');
        console.log(`Esquema public de «${database}» borrado`);
    } finally {
        await dataSource.destroy();
    }
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
