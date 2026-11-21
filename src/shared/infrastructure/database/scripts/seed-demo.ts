// Datos de demostración para desarrollo y para la demo: criterios provisionales, empresas y locales.
//   npm run seed
// No corre en producción. Se puede correr varias veces: no duplica lo que ya existe.
// Los datos de referencia (departamentos, ciudades, rubros, contratos, modalidades, cargos) están en la
// migración base, no acá.
import { readFileSync } from 'fs';
import { join } from 'path';
import dataSource from '../data-source';

// Criterios PROVISIONALES de las preguntas 5 a 8 del cuestionario (docs/datos/criterios-provisionales.json, la misma
// copia que usa el frontend). Se reemplazan con los resultados de la encuesta (R1, 26/11) cambiando solo ese archivo:
// lo que deja de figurar se desactiva, no se borra, para que las respuestas viejas sigan siendo válidas.
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
            const categoryCodes: string[] = [];
            const itemCodes: string[] = [];
            for (const category of CRITERIA.categorias) {
                categoryCodes.push(category.codigo);
                // Una categoría cargada antes de existir los códigos se adopta por su descripción, en vez de duplicarla.
                await manager.query(
                    `UPDATE categorias SET codigo = $1 WHERE codigo IS NULL AND lower(descripcion) = lower($2)
                       AND NOT EXISTS (SELECT 1 FROM categorias WHERE codigo = $1)`,
                    [category.codigo, category.nombre]);
                const [{ id: idCategoria }] = await manager.query(
                    `INSERT INTO categorias (codigo, descripcion, orden, activo) VALUES ($1, $2, $3, true)
                     ON CONFLICT (codigo) WHERE codigo IS NOT NULL
                     DO UPDATE SET descripcion = EXCLUDED.descripcion, orden = EXCLUDED.orden, activo = true
                     RETURNING id`,
                    [category.codigo, category.nombre, category.orden]);
                for (const item of category.items) {
                    itemCodes.push(item.codigo);
                    await manager.query(
                        `UPDATE items SET codigo = $1 WHERE codigo IS NULL AND id_categoria = $2 AND lower(descripcion) = lower($3)
                           AND NOT EXISTS (SELECT 1 FROM items WHERE codigo = $1)`,
                        [item.codigo, idCategoria, item.texto]);
                    const [row] = await manager.query(
                        `INSERT INTO items (codigo, descripcion, id_categoria, orden, activo) VALUES ($1, $2, $3, $4, true)
                         ON CONFLICT (codigo) WHERE codigo IS NOT NULL
                         DO UPDATE SET descripcion = EXCLUDED.descripcion, id_categoria = EXCLUDED.id_categoria,
                                       orden = EXCLUDED.orden, activo = true
                         RETURNING (xmax = 0) AS insertado`,
                        [item.codigo, item.texto, idCategoria, item.orden]);
                    if (row.insertado) nuevas++;
                }
            }
            // Lo que no está en el archivo (incluidos los 10 ítems genéricos anteriores) queda inactivo.
            await manager.query(`UPDATE items SET activo = false WHERE codigo IS NULL OR NOT (codigo = ANY($1))`, [itemCodes]);
            await manager.query(`UPDATE categorias SET activo = false WHERE codigo IS NULL OR NOT (codigo = ANY($1))`, [categoryCodes]);
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
