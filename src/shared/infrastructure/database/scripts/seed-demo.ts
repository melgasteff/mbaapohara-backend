// Datos de demostración para desarrollo y para la demo: criterios provisionales, empresas y locales.
//   npm run seed
// No corre en producción. Se puede correr varias veces: no duplica lo que ya existe ni cambia los criterios cargados.
// Los datos de referencia (departamentos, ciudades, rubros, contratos, modalidades, cargos) están en la
// migración base, no acá.
import { readFileSync } from 'fs';
import { join } from 'path';
import dataSource from '../data-source';

// Criterios PROVISIONALES de las preguntas 5 a 8 del cuestionario (docs/datos/criterios-provisionales.json, fuente
// de la primera carga). Se cargan solo en una base sin categorías; después se administran desde la API (3.8).
// Para volver a cargar el archivo en desarrollo: `npm run db:reset`.
interface CriteriaFile {
    categorias: { codigo: string; nombre: string; orden: number; items: { codigo: string; orden: number; texto: string }[] }[];
}
const CRITERIA: CriteriaFile = JSON.parse(readFileSync(join(process.cwd(), 'docs/datos/criterios-provisionales.json'), 'utf8'));

// Empresas de demostración (aprobadas), con la sección CIIU de su rubro.
const EMPRESAS: [nombre: string, ciiu: string][] = [
    ['Tigo Paraguay', 'J'], ['Personal', 'J'], ['Claro Paraguay', 'J'], ['Banco Continental', 'K'],
    ['Banco Itaú Paraguay', 'K'], ['Visión Banco', 'K'], ['Copa Airlines', 'H'], ['Mercado Libre Paraguay', 'G'],
    ['PedidosYa Paraguay', 'H'], ['Infonet', 'J'], ['Konecta Paraguay', 'N'], ['Frávega Paraguay', 'G'],
    ['Stock Center', 'G'], ['Superseis', 'G'], ['Grupo Pinedo', 'F'],
];

// Locales de demostración (aprobados): empresa, nombre y código INE de la ciudad.
const LOCALES: [empresa: string, nombre: string, ciudadIne: string][] = [
    ['Tigo Paraguay', 'Tigo - Casa Central Asunción', '0000'],
    ['Tigo Paraguay', 'Tigo - Ciudad del Este', '1001'],
    ['Personal', 'Personal - Asunción Centro', '0000'],
    ['Banco Continental', 'Banco Continental - Casa Central', '0000'],
    ['Banco Itaú Paraguay', 'Banco Itaú - Asunción', '0000'],
    ['Infonet', 'Infonet - Asunción', '0000'],
    ['Mercado Libre Paraguay', 'Mercado Libre - Asunción', '0000'],
];

async function main() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('La semilla de demostración no corre con NODE_ENV=production');
    }
    await dataSource.initialize();
    try {
        await dataSource.transaction(async manager => {
            let nuevas = 0;
            // Desde la 3.8 los criterios se administran en /admin/criterios y la base es la fuente de verdad: el archivo
            // se carga solo si todavía no hay ninguna categoría, para no pisar lo que editó el administrador.
            const [{ hay }] = await manager.query('SELECT EXISTS (SELECT 1 FROM categorias) AS hay');
            if (hay) {
                console.log('Criterios: ya hay categorías cargadas; no se tocan (se editan en /admin/criterios)');
            } else {
                for (const category of CRITERIA.categorias) {
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
            }
            for (const [nombre, ciiu] of EMPRESAS) {
                const inserted: unknown[] = await manager.query(
                    `INSERT INTO empresas (nombre, id_rubro, estado)
                     SELECT $1::text, r.id, 'aprobada' FROM rubros r
                     WHERE r.codigo_ciiu = $2::text
                       AND NOT EXISTS (SELECT 1 FROM empresas e WHERE lower(f_unaccent(e.nombre)) = lower(f_unaccent($1::text)))
                     RETURNING id`,
                    [nombre, ciiu]);
                nuevas += inserted.length;
            }
            for (const [empresa, nombre, ciudadIne] of LOCALES) {
                const inserted: unknown[] = await manager.query(
                    `INSERT INTO sucursales (id_empresa, id_ciudad, nombre, estado)
                     SELECT e.id, c.id, $2::text, 'aprobada' FROM empresas e, ciudades c
                     WHERE e.nombre = $1::text AND c.codigo_ine = $3::text
                       AND NOT EXISTS (SELECT 1 FROM sucursales s
                                       WHERE s.id_empresa = e.id AND lower(f_unaccent(s.nombre)) = lower(f_unaccent($2::text)))
                     RETURNING id`,
                    [empresa, nombre, ciudadIne]);
                nuevas += inserted.length;
            }
            console.log(`Semilla de demostración aplicada: ${nuevas} filas nuevas`);
        });
    } finally {
        await dataSource.destroy();
    }
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
