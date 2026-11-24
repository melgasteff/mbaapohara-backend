import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Page, PageRequest, pageOffset } from 'src/shared/domain/page';
import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { escapeLike } from './catalog-refs';
import { CompaniesService } from './companies.service';
import { CompanyDTO } from './dto/company.dto';
import { CompanyDetailDTO, CompanyFacetsDTO, CompanySummaryDTO, TopicDTO } from './dto/company-summary.dto';
import { OfficeDTO } from './offices/dto/office.dto';
import { GROUP_SECTIONS, SectorGroup, sectorGroup } from './sector-groups';

/** Reseñas desde las que se muestran la distribución y los temas (indicadores con 3 o más). */
export const MIN_REVIEWS = 3;

export enum CompanyOrder {
    Nombre = 'nombre',
    Resenas = 'resenas',
    Calificacion = 'calificacion',
}

export interface DirectoryFilters {
    q?: string;
    rubro?: number;
    grupo?: SectorGroup;
    departamento?: number;
    ciudad?: number;
    conResenas?: boolean;
}

type FilterName = keyof DirectoryFilters;

const FROM = `FROM empresas e
    JOIN rubros rub ON rub.id = e.id_rubro
    LEFT JOIN (
        SELECT id_empresa, count(*)::int AS cantidad, avg(calificacion) AS promedio
        FROM resenas_publicas GROUP BY id_empresa
    ) res ON res.id_empresa = e.id`;

// Con menos de 3 reseñas el promedio dice poco: esas empresas van después de las demás.
const ORDER: Record<CompanyOrder, string> = {
    [CompanyOrder.Nombre]: 'e.nombre, e.id',
    [CompanyOrder.Resenas]: 'COALESCE(res.cantidad, 0) DESC, e.nombre, e.id',
    [CompanyOrder.Calificacion]: `COALESCE(res.cantidad, 0) >= ${MIN_REVIEWS} DESC, res.promedio DESC NULLS LAST, res.cantidad DESC, e.nombre, e.id`,
};

/** Parámetros de una consulta, numerados a medida que se agregan. */
class Params {
    readonly values: unknown[] = [];
    add(value: unknown): string {
        this.values.push(value);
        return `$${this.values.length}`;
    }
}

/**
 * Directorio público: empresas aprobadas con el resumen de sus reseñas publicadas. Lee la vista `resenas_publicas` y las
 * respuestas, que son de `reviews`: importar ese módulo crearía un ciclo, porque `reviews` ya usa `companies`
 * (excepción de solo lectura, docs/arquitectura.md).
 */
@Injectable()
export class CompanyDirectoryService {
    constructor(private readonly dataSource: DataSource, private readonly companies: CompaniesService) { }

    async findPage(request: PageRequest, filters: DirectoryFilters, order: CompanyOrder): Promise<Page<CompanySummaryDTO>> {
        const params = new Params();
        const where = this.where(filters, params);
        const [{ total }] = await this.dataSource.query(`SELECT count(*)::int AS total ${FROM} ${where}`, params.values);
        const rows: { id: number; nombre: string; estado: ProposalStatus; idRubro: number; ciiu: string; rubro: string; cantidad: number; promedio: number | null }[] =
            await this.dataSource.query(
                `SELECT e.id, e.nombre, e.estado, rub.id AS "idRubro", rub.codigo_ciiu AS ciiu, rub.nombre AS rubro,
                        COALESCE(res.cantidad, 0) AS cantidad, round(res.promedio, 1)::float8 AS promedio
                 ${FROM} ${where}
                 ORDER BY ${ORDER[order]}
                 LIMIT ${params.add(request.pageSize)} OFFSET ${params.add(pageOffset(request))}`,
                params.values);
        const [topics, mainTopic] = await Promise.all([this.topics(rows.map(row => row.id)), this.mainTopicCode()]);
        const data = rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            rubro: { id: row.idRubro, codigoCiiu: row.ciiu, nombre: row.rubro, grupo: sectorGroup(row.ciiu) },
            estado: row.estado,
            cantidadResenas: row.cantidad,
            promedio: row.promedio,
            temaPrincipal: topics.get(row.id)?.find(topic => topic.codigo === mainTopic) ?? null,
            logoUrl: null,
        }));
        return { data, total, page: request.page, pageSize: request.pageSize };
    }

    /** Perfil de una empresa aprobada: resumen, distribución, temas y locales con su cantidad de reseñas. */
    async findDetail(id: number): Promise<CompanyDetailDTO> {
        const { company, offices } = await this.companies.findDetail(id);
        const rating: { estrellas: number; cantidad: number }[] = await this.dataSource.query(
            'SELECT calificacion AS estrellas, count(*)::int AS cantidad FROM resenas_publicas WHERE id_empresa = $1 GROUP BY calificacion', [id]);
        const perOffice: { id: number; cantidad: number }[] = await this.dataSource.query(
            'SELECT id_sucursal AS id, count(*)::int AS cantidad FROM resenas_publicas WHERE id_empresa = $1 GROUP BY id_sucursal', [id]);
        const [topics, mainTopic] = await Promise.all([this.topics([id]), this.mainTopicCode()]);

        const total = rating.reduce((sum, row) => sum + row.cantidad, 0);
        const points = rating.reduce((sum, row) => sum + row.estrellas * row.cantidad, 0);
        const count = (stars: number) => rating.find(row => row.estrellas === stars)?.cantidad ?? 0;
        const officeCounts = new Map(perOffice.map(row => [row.id, row.cantidad]));
        const temas = topics.get(id) ?? [];
        return {
            ...CompanyDTO.from(company),
            cantidadResenas: total,
            promedio: total ? Math.round((points * 10) / total) / 10 : null,
            temaPrincipal: temas.find(topic => topic.codigo === mainTopic) ?? null,
            logoUrl: null,
            distribucion: total >= MIN_REVIEWS ? [5, 4, 3, 2, 1].map(estrellas => ({ estrellas, cantidad: count(estrellas) })) : [],
            temas,
            locales: offices.map(office => ({ ...OfficeDTO.from(office), cantidadResenas: officeCounts.get(office.id) ?? 0 })),
        };
    }

    async facets(filters: DirectoryFilters): Promise<CompanyFacetsDTO> {
        const [total, experiencias, grupos, departamentos, ciudades, resenas] = await Promise.all([
            this.count(filters),
            this.countReviews(filters),
            this.groupFacet(filters),
            this.departmentFacet(filters),
            this.cityFacet(filters),
            this.reviewsFacet(filters),
        ]);
        return { total, experiencias, grupos, departamentos, ciudades, resenas };
    }

    private async count(filters: DirectoryFilters, skip: FilterName[] = []): Promise<number> {
        const params = new Params();
        const [{ total }] = await this.dataSource.query(`SELECT count(*)::int AS total ${FROM} ${this.where(filters, params, skip)}`, params.values);
        return total;
    }

    private async countReviews(filters: DirectoryFilters): Promise<number> {
        const params = new Params();
        const where = this.where(filters, params);
        const place = [
            filters.ciudad ? `AND p.id_ciudad = ${params.add(filters.ciudad)}` : '',
            filters.departamento ? `AND ci.id_departamento = ${params.add(filters.departamento)}` : '',
        ].join(' ');
        const [{ total }] = await this.dataSource.query(
            `SELECT count(*)::int AS total
             FROM resenas_publicas p
             JOIN ciudades ci ON ci.id = p.id_ciudad
             WHERE p.id_empresa IN (SELECT e.id ${FROM} ${where}) ${place}`, params.values);
        return total;
    }

    private async groupFacet(filters: DirectoryFilters) {
        const params = new Params();
        const rows: { ciiu: string; cantidad: number }[] = await this.dataSource.query(
            `SELECT rub.codigo_ciiu AS ciiu, count(*)::int AS cantidad ${FROM} ${this.where(filters, params, ['grupo'])} GROUP BY rub.codigo_ciiu`,
            params.values);
        const opciones = Object.values(SectorGroup).map(grupo => ({
            grupo,
            cantidad: rows.filter(row => sectorGroup(row.ciiu) === grupo).reduce((sum, row) => sum + row.cantidad, 0),
        }));
        return { total: rows.reduce((sum, row) => sum + row.cantidad, 0), opciones };
    }

    // Una empresa con locales en varios lugares cuenta en cada uno: por eso el total no es la suma.
    private async departmentFacet(filters: DirectoryFilters) {
        const skip: FilterName[] = ['departamento', 'ciudad'];
        const params = new Params();
        const opciones = await this.dataSource.query(
            `SELECT d.id, d.nombre, count(DISTINCT s.id_empresa)::int AS cantidad
             FROM sucursales s
             JOIN ciudades ci ON ci.id = s.id_ciudad
             JOIN departamentos d ON d.id = ci.id_departamento
             WHERE s.estado = 'aprobada' AND s.id_empresa IN (SELECT e.id ${FROM} ${this.where(filters, params, skip)})
             GROUP BY d.id, d.nombre
             ORDER BY d.nombre`, params.values);
        return { total: await this.count(filters, skip), opciones };
    }

    private async cityFacet(filters: DirectoryFilters) {
        const skip: FilterName[] = ['ciudad'];
        const params = new Params();
        const where = this.where(filters, params, skip);
        const department = filters.departamento ? `AND ci.id_departamento = ${params.add(filters.departamento)}` : '';
        const opciones = await this.dataSource.query(
            `SELECT ci.id, ci.nombre, ci.id_departamento AS "idDepartamento", count(DISTINCT s.id_empresa)::int AS cantidad
             FROM sucursales s
             JOIN ciudades ci ON ci.id = s.id_ciudad
             WHERE s.estado = 'aprobada' ${department} AND s.id_empresa IN (SELECT e.id ${FROM} ${where})
             GROUP BY ci.id, ci.nombre, ci.id_departamento
             ORDER BY cantidad DESC, ci.nombre`, params.values);
        return { total: await this.count(filters, skip), opciones };
    }

    private async reviewsFacet(filters: DirectoryFilters) {
        const params = new Params();
        const [row] = await this.dataSource.query(
            `SELECT count(*)::int AS total, count(*) FILTER (WHERE res.cantidad > 0)::int AS con,
                    count(*) FILTER (WHERE res.cantidad IS NULL)::int AS sin
             ${FROM} ${this.where(filters, params, ['conResenas'])}`, params.values);
        return row;
    }

    /**
     * Cumplimiento por categoría activa: respuestas «Sí» sobre todas las que no son «No sé». Una categoría aparece solo
     * si la respondieron 3 reseñas o más, para que un porcentaje nunca salga de una sola persona.
     */
    private async topics(companyIds: number[]): Promise<Map<number, TopicDTO[]>> {
        const result = new Map<number, TopicDTO[]>();
        if (!companyIds.length) return result;
        const rows: (TopicDTO & { idEmpresa: number })[] = await this.dataSource.query(
            `SELECT p.id_empresa AS "idEmpresa", cat.codigo, cat.descripcion AS nombre,
                    round(100.0 * count(*) FILTER (WHERE rc.respuesta = 'si') / count(*))::int AS "porcentajeSi",
                    count(DISTINCT p.id_resena)::int AS resenas
             FROM resenas_publicas p
             JOIN respuestas_criterio rc ON rc.id_version = p.id_version AND rc.respuesta <> 'no_sabe'
             JOIN items i ON i.id = rc.id_item AND i.activo
             JOIN categorias cat ON cat.id = i.id_categoria AND cat.activo
             WHERE p.id_empresa = ANY($1)
             GROUP BY p.id_empresa, cat.id, cat.codigo, cat.descripcion, cat.orden
             HAVING count(DISTINCT p.id_resena) >= ${MIN_REVIEWS}
             ORDER BY cat.orden, cat.id`, [companyIds]);
        for (const { idEmpresa, ...topic } of rows) result.set(idEmpresa, [...(result.get(idEmpresa) ?? []), topic]);
        return result;
    }

    /** Primera categoría que se responde. Es la misma para todas las empresas, así las filas se pueden comparar. */
    private async mainTopicCode(): Promise<string | null> {
        const rows: { codigo: string }[] = await this.dataSource.query(
            `SELECT cat.codigo FROM categorias cat
             WHERE cat.activo AND EXISTS (SELECT 1 FROM items i WHERE i.id_categoria = cat.id AND i.activo)
             ORDER BY cat.orden, cat.id LIMIT 1`);
        return rows[0]?.codigo ?? null;
    }

    /** Condiciones del directorio. `skip` deja afuera el filtro propio de una faceta. */
    private where(filters: DirectoryFilters, params: Params, skip: FilterName[] = []): string {
        const active = (name: FilterName) => filters[name] !== undefined && !skip.includes(name);
        const conditions = [`e.estado = 'aprobada'`];
        if (active('q') && filters.q) {
            const text = params.add(`%${escapeLike(filters.q)}%`);
            const matches = (column: string) => `lower(f_unaccent(${column})) LIKE lower(f_unaccent(${text}))`;
            conditions.push(`(${matches('e.nombre')} OR ${matches('rub.nombre')} OR EXISTS (SELECT 1 FROM sucursales s
                WHERE s.id_empresa = e.id AND s.estado = 'aprobada' AND ${matches('s.nombre')}))`);
        }
        if (active('rubro')) conditions.push(`e.id_rubro = ${params.add(filters.rubro)}`);
        if (active('grupo')) conditions.push(`rub.codigo_ciiu = ANY(${params.add(GROUP_SECTIONS[filters.grupo])})`);
        if (active('departamento')) {
            conditions.push(`EXISTS (SELECT 1 FROM sucursales s JOIN ciudades ci ON ci.id = s.id_ciudad
                WHERE s.id_empresa = e.id AND s.estado = 'aprobada' AND ci.id_departamento = ${params.add(filters.departamento)})`);
        }
        if (active('ciudad')) {
            conditions.push(`EXISTS (SELECT 1 FROM sucursales s
                WHERE s.id_empresa = e.id AND s.estado = 'aprobada' AND s.id_ciudad = ${params.add(filters.ciudad)})`);
        }
        if (active('conResenas')) conditions.push(filters.conResenas ? 'res.cantidad > 0' : 'res.cantidad IS NULL');
        return `WHERE ${conditions.join(' AND ')}`;
    }
}
