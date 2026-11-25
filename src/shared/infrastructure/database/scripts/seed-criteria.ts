// Carga los criterios de la reseña (docs/datos/criterios-provisionales.json), solo en una base sin categorías.
//   npm run seed:criteria
// A diferencia de la semilla de demostración, corre también en producción: no carga empresas ni locales.
// Después, los criterios se administran en /admin/criterios (3.8).
import { readFileSync } from 'fs';
import { join } from 'path';
import { EntityManager } from 'typeorm';
import dataSource from '../data-source';

interface CriteriaFile {
    categorias: { codigo: string; nombre: string; orden: number; items: { codigo: string; orden: number; texto: string }[] }[];
}

/** Devuelve las filas nuevas; 0 si ya había categorías, que no se tocan. */
export async function loadCriteria(manager: EntityManager): Promise<number> {
    // Desde la 3.8 la base es la fuente de verdad: el archivo no pisa lo que editó el administrador.
    const [{ hay }] = await manager.query('SELECT EXISTS (SELECT 1 FROM categorias) AS hay');
    if (hay) {
        console.log('Criterios: ya hay categorías cargadas; no se tocan (se editan en /admin/criterios)');
        return 0;
    }
    const file: CriteriaFile = JSON.parse(readFileSync(join(process.cwd(), 'docs/datos/criterios-provisionales.json'), 'utf8'));
    let nuevas = 0;
    for (const category of file.categorias) {
        const [{ id: idCategoria }] = await manager.query(
            'INSERT INTO categorias (codigo, descripcion, orden) VALUES ($1, $2, $3) RETURNING id',
            [category.codigo, category.nombre, category.orden]);
        nuevas++;
        for (const item of category.items) {
            await manager.query(
                'INSERT INTO items (codigo, descripcion, id_categoria, orden) VALUES ($1, $2, $3, $4)',
                [item.codigo, item.texto, idCategoria, item.orden]);
            nuevas++;
        }
    }
    return nuevas;
}

async function main() {
    console.log(`Base: ${process.env.DB_NAME} en ${process.env.DB_HOST}`);
    await dataSource.initialize();
    try {
        const nuevas = await dataSource.transaction(loadCriteria);
        console.log(`Criterios: ${nuevas} filas nuevas`);
    } finally {
        await dataSource.destroy();
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    });
}
