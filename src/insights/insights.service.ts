import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MIN_REVIEWS } from 'src/companies/company-directory.service';
import { GROUP_SECTIONS } from 'src/companies/sector-groups';
import { InsightsQueryDTO } from './dto/insights-query.dto';
import { CategoryInsightDTO, IndicatorDTO, InsightsDTO } from './dto/insights.dto';

interface Counts {
    resenas: number;
    si: number;
    enParte: number;
    no: number;
    noSabe: number;
}

/**
 * Panel de indicadores (3.6). Módulo liviano de solo lectura: lee la vista `resenas_publicas` y las respuestas, que son
 * de `reviews`, y los criterios activos (docs/arquitectura.md). Los filtros de lugar se aplican al local de cada reseña.
 */
@Injectable()
export class InsightsService {
    constructor(private readonly dataSource: DataSource) { }

    async find(filters: InsightsQueryDTO): Promise<InsightsDTO> {
        const { sql: reviews, values } = this.filteredReviews(filters);
        const [[totals], items, answers] = await Promise.all([
            this.dataSource.query(
                `SELECT count(*)::int AS resenas, count(DISTINCT f.id_empresa)::int AS empresas, avg(f.calificacion)::float8 AS promedio
                 FROM (${reviews}) f`, values),
            this.dataSource.query(
                `SELECT cat.id AS "idCategoria", cat.codigo AS "codigoCategoria", cat.descripcion AS categoria,
                        i.id AS "idItem", i.codigo, i.descripcion AS texto
                 FROM categorias cat JOIN items i ON i.id_categoria = cat.id AND i.activo
                 WHERE cat.activo
                 ORDER BY cat.orden, cat.id, i.orden, i.id`),
            // Una fila por criterio y otra por categoría (GROUPING SETS): «reseñas» cuenta cada reseña una vez por grupo.
            this.dataSource.query(
                `SELECT i.id_categoria AS "idCategoria", GROUPING(i.id) = 1 AS "esCategoria", i.id AS "idItem",
                        count(DISTINCT f.id_resena) FILTER (WHERE rc.respuesta <> 'no_sabe')::int AS resenas,
                        count(*) FILTER (WHERE rc.respuesta = 'si')::int AS si,
                        count(*) FILTER (WHERE rc.respuesta = 'en_parte')::int AS "enParte",
                        count(*) FILTER (WHERE rc.respuesta = 'no')::int AS no,
                        count(*) FILTER (WHERE rc.respuesta = 'no_sabe')::int AS "noSabe"
                 FROM (${reviews}) f
                 JOIN respuestas_criterio rc ON rc.id_version = f.id_version
                 JOIN items i ON i.id = rc.id_item AND i.activo
                 JOIN categorias cat ON cat.id = i.id_categoria AND cat.activo
                 GROUP BY GROUPING SETS ((i.id_categoria), (i.id_categoria, i.id))`, values),
        ]);

        const byItem = new Map<number, Counts>();
        const byCategory = new Map<number, Counts>();
        for (const row of answers as (Counts & { idCategoria: number; esCategoria: boolean; idItem: number })[]) {
            if (row.esCategoria) byCategory.set(row.idCategoria, row);
            else byItem.set(row.idItem, row);
        }

        const categorias: CategoryInsightDTO[] = [];
        for (const item of items as { idCategoria: number; codigoCategoria: string; categoria: string; idItem: number; codigo: string; texto: string }[]) {
            let category = categorias.at(-1);
            if (category?.codigo !== item.codigoCategoria) {
                category = { codigo: item.codigoCategoria, nombre: item.categoria, indicador: indicator(byCategory.get(item.idCategoria)), criterios: [] };
                categorias.push(category);
            }
            category.criterios.push({ codigo: item.codigo, texto: item.texto, indicador: indicator(byItem.get(item.idItem)) });
        }

        return {
            resenas: totals.resenas,
            empresas: totals.empresas,
            promedio: totals.resenas >= MIN_REVIEWS ? Math.round(totals.promedio * 10) / 10 : null,
            minimo: MIN_REVIEWS,
            categorias,
        };
    }

    /** Reseñas publicadas que cumplen los filtros, con sus parámetros numerados. */
    private filteredReviews(filters: InsightsQueryDTO): { sql: string; values: unknown[] } {
        const values: unknown[] = [];
        const add = (value: unknown) => `$${values.push(value)}`;
        const conditions = ['true'];
        if (filters.rubro !== undefined) conditions.push(`e.id_rubro = ${add(filters.rubro)}`);
        if (filters.grupo !== undefined) conditions.push(`rub.codigo_ciiu = ANY(${add(GROUP_SECTIONS[filters.grupo])})`);
        if (filters.departamento !== undefined) conditions.push(`ci.id_departamento = ${add(filters.departamento)}`);
        if (filters.ciudad !== undefined) conditions.push(`p.id_ciudad = ${add(filters.ciudad)}`);
        const sql = `SELECT p.* FROM resenas_publicas p
            JOIN empresas e ON e.id = p.id_empresa
            JOIN rubros rub ON rub.id = e.id_rubro
            JOIN ciudades ci ON ci.id = p.id_ciudad
            WHERE ${conditions.join(' AND ')}`;
        return { sql, values };
    }
}

/** Con menos de 3 reseñas que respondieron algo distinto de «No sé», no se muestra nada: ni siquiera los conteos. */
function indicator(counts: Counts | undefined): IndicatorDTO | null {
    if (!counts || counts.resenas < MIN_REVIEWS) return null;
    const answered = counts.si + counts.enParte + counts.no;
    return {
        resenas: counts.resenas,
        si: counts.si,
        enParte: counts.enParte,
        no: counts.no,
        noSabe: counts.noSabe,
        porcentajeSi: Math.round((100 * counts.si) / answered),
    };
}
