import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { JobsService } from 'src/catalogs/jobs/jobs.service';
import { Page, PageRequest, pageOffset } from 'src/shared/domain/page';
import { isUniqueViolation } from 'src/shared/infrastructure/database/pg-errors';
import { ReviewAlreadyExistsException } from '../../application/exception/review.exceptions';
import { ReviewContent, ReviewStatus, WorkSituation } from '../../domain/model/review';
import {
    MyReview, NamedCount, OfficeCount, OwnedReview, PublicReview, PublicReviewFacets, PublicReviewFilters, PublicReviewOrder, QueueVersion, VersionToDecide,
} from '../../domain/model/review-views';
import { ReviewRepository, VersionDecision } from '../../domain/port/review-repository.port';

// Respuestas de una versión a los criterios activos, en el orden de los criterios, como JSON.
const ANSWERS = `COALESCE((
    SELECT json_agg(json_build_object('codigo', i.codigo, 'respuesta', rc.respuesta) ORDER BY cat.orden, cat.id, i.orden, i.id)
    FROM respuestas_criterio rc
    JOIN items i ON i.id = rc.id_item
    JOIN categorias cat ON cat.id = i.id_categoria
    WHERE rc.id_version = v.id AND i.activo AND cat.activo), '[]')`;

const OFFICE = `json_build_object('id', s.id, 'nombre', s.nombre, 'ciudad', ci.nombre) AS local`;

const PLACE = `json_build_object('id', e.id, 'nombre', e.nombre) AS empresa, ${OFFICE}`;

const RELATION = `v.situacion, v.ultimo_anio AS "ultimoAnio",
    json_build_object('id', tc.id, 'nombre', tc.nombre) AS "tipoContrato",
    json_build_object('id', m.id, 'nombre', m.nombre) AS modalidad,
    v.calificacion, v.lo_bueno AS "loBueno", v.a_mejorar AS "aMejorar", ${ANSWERS} AS respuestas`;

const VERSION_JOINS = `JOIN cargos c ON c.id = v.id_cargo
    JOIN tipo_contrato tc ON tc.id = v.id_tipo_contrato
    JOIN modalidades m ON m.id = v.id_modalidad`;

// Reseñas visibles para el público: las define la vista resenas_publicas (versión publicada, en un local y una empresa
// aprobados). Nunca el autor.
const PUBLIC_FROM = `FROM resenas_publicas p
    JOIN resenas r ON r.id = p.id_resena
    JOIN versiones_resena v ON v.id = p.id_version
    JOIN sucursales s ON s.id = p.id_sucursal
    JOIN empresas e ON e.id = p.id_empresa
    JOIN ciudades ci ON ci.id = s.id_ciudad
    ${VERSION_JOINS}`;

// Un cargo propuesto se muestra solo cuando el administrador lo aprueba: su texto no pasa por la moderación.
// Del momento de publicación solo se muestra el mes, en la hora de Paraguay.
const PUBLIC_SELECT = `SELECT r.id, ${PLACE},
    CASE WHEN c.estado = 'aprobada' THEN c.descripcion END AS cargo, ${RELATION},
    to_char(v.fecha_decision AT TIME ZONE 'America/Asuncion', 'YYYY-MM') AS "mesPublicacion"`;

const PUBLIC_ORDER: Record<PublicReviewOrder, string> = {
    [PublicReviewOrder.Recent]: 'v.fecha_decision DESC, r.id DESC',
    [PublicReviewOrder.Best]: 'v.calificacion DESC, v.fecha_decision DESC, r.id DESC',
    [PublicReviewOrder.Worst]: 'v.calificacion, v.fecha_decision DESC, r.id DESC',
};

/** Condiciones del listado público. Siempre empieza con WHERE, para poder sumarle otras. */
function publicWhere(filters: PublicReviewFilters): { where: string; params: unknown[] } {
    const conditions: string[] = ['TRUE'];
    const params: unknown[] = [];
    const add = (sql: string, value: unknown) => {
        if (value === undefined) return;
        params.push(value);
        conditions.push(sql.replace('?', `$${params.length}`));
    };
    add('e.id = ?', filters.companyId);
    add('s.id = ?', filters.officeId);
    add('v.id_cargo = ?', filters.jobId);
    add('s.id_ciudad = ?', filters.cityId);
    add('v.id_tipo_contrato = ?', filters.contractTypeId);
    add('v.id_modalidad = ?', filters.workModeId);
    add('v.situacion = ?', filters.situation);
    return { where: `WHERE ${conditions.join(' AND ')}`, params };
}

/**
 * Adaptador de ReviewRepository con SQL sobre las tablas de la migración 3.2. Usa SQL y no entidades de TypeORM porque
 * las lecturas arman vistas con agregados JSON y las escrituras necesitan control fino de la transacción.
 */
@Injectable()
export class SqlReviewRepository extends ReviewRepository {
    constructor(private readonly dataSource: DataSource, private readonly jobs: JobsService) {
        super();
    }

    async create(userId: number, officeId: number, content: ReviewContent): Promise<{ reviewId: number; versionId: number }> {
        try {
            return await this.dataSource.transaction(async manager => {
                const [{ id: reviewId }] = await manager.query(
                    'INSERT INTO resenas (id_usuario, id_sucursal) VALUES ($1, $2) RETURNING id', [userId, officeId]);
                const versionId = await this.insertVersion(manager, reviewId, 1, content);
                return { reviewId, versionId };
            });
        } catch (error) {
            // Una reseña por persona y local (R7): lo garantiza la restricción UNIQUE, no una búsqueda previa.
            if (isUniqueViolation(error)) throw new ReviewAlreadyExistsException();
            throw error;
        }
    }

    addVersion(reviewId: number, content: ReviewContent): Promise<{ versionId: number }> {
        return this.dataSource.transaction(async manager => {
            // Bloquea la reseña: dos ediciones a la vez no pueden tomar el mismo número de versión.
            await manager.query('SELECT 1 FROM resenas WHERE id = $1 FOR UPDATE', [reviewId]);
            const [{ numero }] = await manager.query(
                'SELECT COALESCE(max(numero), 0) + 1 AS numero FROM versiones_resena WHERE id_resena = $1', [reviewId]);
            return { versionId: await this.insertVersion(manager, reviewId, numero, content) };
        });
    }

    applyDecision(reviewId: number, versionId: number, decision: VersionDecision): Promise<void> {
        return this.dataSource.transaction(async manager => {
            await manager.query(
                `UPDATE versiones_resena SET estado = $2, categoria_moderacion = $3, motivo_moderacion = $4, fecha_decision = now()
                 WHERE id = $1`,
                [versionId, decision.status, decision.category, decision.message]);
            // Solo una versión publicada reemplaza a la visible: si la nueva se rechaza o se revisa, queda la anterior.
            if (decision.status === ReviewStatus.Published) {
                await manager.query(
                    'UPDATE resenas SET id_version_publicada = $2, fecha_actualizacion = now() WHERE id = $1', [reviewId, versionId]);
            }
        });
    }

    async findOwned(reviewId: number, userId: number): Promise<OwnedReview | null> {
        const rows: OwnedReview[] = await this.dataSource.query(
            `SELECT r.id, last.estado AS "lastStatus"
             FROM resenas r
             CROSS JOIN LATERAL (SELECT estado FROM versiones_resena WHERE id_resena = r.id ORDER BY numero DESC LIMIT 1) last
             WHERE r.id = $1 AND r.id_usuario = $2`,
            [reviewId, userId]);
        return rows[0] ?? null;
    }

    async delete(reviewId: number): Promise<void> {
        // En cascada: versiones y respuestas. El registro de moderación queda sin reseña (ON DELETE SET NULL).
        await this.dataSource.query('DELETE FROM resenas WHERE id = $1', [reviewId]);
    }

    listMine(userId: number): Promise<MyReview[]> {
        return this.dataSource.query(
            `SELECT r.id, json_build_object('id', e.id, 'nombre', e.nombre, 'codigoCiiu', rub.codigo_ciiu) AS empresa, ${OFFICE},
                    (r.id_version_publicada IS NOT NULL) AS publicada,
                    json_build_object(
                        'numero', v.numero, 'estado', v.estado, 'categoria', v.categoria_moderacion,
                        'motivo', v.motivo_moderacion, 'fecha', v.fecha_creacion,
                        'cargo', json_build_object('id', c.id, 'descripcion', c.descripcion, 'aprobado', c.estado = 'aprobada'),
                        'situacion', v.situacion, 'ultimoAnio', v.ultimo_anio,
                        'tipoContrato', json_build_object('id', tc.id, 'nombre', tc.nombre),
                        'modalidad', json_build_object('id', m.id, 'nombre', m.nombre),
                        'calificacion', v.calificacion, 'loBueno', v.lo_bueno, 'aMejorar', v.a_mejorar,
                        'respuestas', ${ANSWERS}
                    ) AS "ultimaVersion"
             FROM resenas r
             JOIN sucursales s ON s.id = r.id_sucursal
             JOIN empresas e ON e.id = s.id_empresa
             JOIN rubros rub ON rub.id = e.id_rubro
             JOIN ciudades ci ON ci.id = s.id_ciudad
             CROSS JOIN LATERAL (SELECT * FROM versiones_resena WHERE id_resena = r.id ORDER BY numero DESC LIMIT 1) v
             ${VERSION_JOINS}
             WHERE r.id_usuario = $1
             ORDER BY r.fecha_actualizacion DESC, r.id DESC`,
            [userId]);
    }

    async listPublic(filters: PublicReviewFilters, request: PageRequest, order: PublicReviewOrder): Promise<Page<PublicReview>> {
        const { where, params } = publicWhere(filters);

        const [data, [{ total }]] = await Promise.all([
            this.dataSource.query(
                `${PUBLIC_SELECT} ${PUBLIC_FROM} ${where}
                 ORDER BY ${PUBLIC_ORDER[order]}
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
                [...params, request.pageSize, pageOffset(request)]),
            this.dataSource.query(`SELECT count(*)::int AS total ${PUBLIC_FROM} ${where}`, params),
        ]);
        return { data, total, page: request.page, pageSize: request.pageSize };
    }

    async publicFacets(filters: PublicReviewFilters): Promise<PublicReviewFacets> {
        // Cada conteo aplica los demás filtros y no el propio.
        const facet = async <T>(own: keyof PublicReviewFilters, select: string, groupBy: string, extra = ''): Promise<{ total: number; opciones: T[] }> => {
            const { where, params } = publicWhere({ ...filters, [own]: undefined });
            const [[{ total }], opciones] = await Promise.all([
                this.dataSource.query(`SELECT count(*)::int AS total ${PUBLIC_FROM} ${where}`, params),
                this.dataSource.query(
                    `SELECT ${select}, count(*)::int AS cantidad ${PUBLIC_FROM} ${where} ${extra} GROUP BY ${groupBy} ORDER BY ${groupBy}`, params),
            ]);
            return { total, opciones };
        };
        const { where, params } = publicWhere(filters);
        const [[{ total }], local, cargo, tipoContrato, modalidad, situacion] = await Promise.all([
            this.dataSource.query(`SELECT count(*)::int AS total ${PUBLIC_FROM} ${where}`, params),
            facet<OfficeCount>('officeId', 's.id, s.nombre, ci.nombre AS ciudad', 'ci.nombre, s.nombre, s.id'),
            // Un cargo propuesto y sin aprobar no se muestra: su texto no pasa por la moderación.
            facet<NamedCount>('jobId', 'c.id, c.descripcion AS nombre', 'c.descripcion, c.id', `AND c.estado = 'aprobada'`),
            facet<NamedCount>('contractTypeId', 'tc.id, tc.nombre', 'tc.id, tc.nombre'),
            facet<NamedCount>('workModeId', 'm.id, m.nombre', 'm.id, m.nombre'),
            facet<{ valor: WorkSituation; cantidad: number }>('situation', 'v.situacion AS valor', 'v.situacion'),
        ]);
        return { total, local, cargo, tipoContrato, modalidad, situacion };
    }

    async findPublic(reviewId: number): Promise<PublicReview | null> {
        const rows: PublicReview[] = await this.dataSource.query(`${PUBLIC_SELECT} ${PUBLIC_FROM} WHERE r.id = $1`, [reviewId]);
        return rows[0] ?? null;
    }

    async listQueue(request: PageRequest): Promise<Page<QueueVersion>> {
        // Cola de revisión humana: sin id_usuario ni datos de la cuenta (política, sección 6).
        const from = `FROM versiones_resena v
            JOIN resenas r ON r.id = v.id_resena
            JOIN sucursales s ON s.id = r.id_sucursal
            JOIN empresas e ON e.id = s.id_empresa
            JOIN ciudades ci ON ci.id = s.id_ciudad
            ${VERSION_JOINS}
            WHERE v.estado = 'en_revision'`;
        const [data, [{ total }]] = await Promise.all([
            this.dataSource.query(
                `SELECT v.id AS "idVersion", r.id AS "idResena", v.numero, ${PLACE},
                        json_build_object('descripcion', c.descripcion, 'aprobado', c.estado = 'aprobada') AS cargo, ${RELATION},
                        v.fecha_creacion AS "fechaEnvio", (r.id_version_publicada IS NOT NULL) AS "tieneVersionPublicada"
                 ${from}
                 ORDER BY v.fecha_creacion, v.id
                 LIMIT $1 OFFSET $2`,
                [request.pageSize, pageOffset(request)]),
            this.dataSource.query(`SELECT count(*)::int AS total ${from}`),
        ]);
        return { data, total, page: request.page, pageSize: request.pageSize };
    }

    async findVersion(versionId: number): Promise<VersionToDecide | null> {
        const rows: VersionToDecide[] = await this.dataSource.query(
            `SELECT id AS "idVersion", id_resena AS "idResena", estado, lo_bueno AS "loBueno", a_mejorar AS "aMejorar"
             FROM versiones_resena WHERE id = $1`,
            [versionId]);
        return rows[0] ?? null;
    }

    decideInReview(reviewId: number, versionId: number, decision: VersionDecision): Promise<boolean> {
        return this.dataSource.transaction(async manager => {
            const [rows] = await manager.query(
                `UPDATE versiones_resena SET estado = $2, categoria_moderacion = $3, motivo_moderacion = $4, fecha_decision = now()
                 WHERE id = $1 AND estado = 'en_revision' RETURNING id`,
                [versionId, decision.status, decision.category, decision.message]);
            if (!rows.length) return false;
            if (decision.status === ReviewStatus.Published) {
                await manager.query(
                    'UPDATE resenas SET id_version_publicada = $2, fecha_actualizacion = now() WHERE id = $1', [reviewId, versionId]);
            }
            return true;
        });
    }

    retirePublished(reviewId: number, decision: VersionDecision): Promise<{ versionId: number; loBueno: string; aMejorar: string } | null> {
        return this.dataSource.transaction(async manager => {
            const [review] = await manager.query('SELECT id_version_publicada AS id FROM resenas WHERE id = $1 FOR UPDATE', [reviewId]);
            if (!review?.id) return null;
            const [[version]] = await manager.query(
                `UPDATE versiones_resena SET estado = $2, categoria_moderacion = $3, motivo_moderacion = $4, fecha_decision = now()
                 WHERE id = $1 RETURNING id AS "versionId", lo_bueno AS "loBueno", a_mejorar AS "aMejorar"`,
                [review.id, decision.status, decision.category, decision.message]);
            await manager.query('UPDATE resenas SET id_version_publicada = NULL, fecha_actualizacion = now() WHERE id = $1', [reviewId]);
            return version;
        });
    }

    /** Inserta una versión en revisión con sus respuestas, dentro de la transacción recibida. Devuelve su id. */
    private async insertVersion(manager: EntityManager, reviewId: number, numero: number, content: ReviewContent): Promise<number> {
        const jobId = 'id' in content.job ? content.job.id : await this.jobs.propose(content.job.proposed, manager);
        const [{ id }] = await manager.query(
            `INSERT INTO versiones_resena (id_resena, numero, id_cargo, situacion, ultimo_anio, id_tipo_contrato, id_modalidad,
                                           calificacion, lo_bueno, a_mejorar)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [reviewId, numero, jobId, content.situation, content.lastYear, content.contractTypeId, content.workModeId,
                content.rating, content.loBueno, content.aMejorar]);
        await manager.query(
            `INSERT INTO respuestas_criterio (id_version, id_item, respuesta)
             SELECT $1, item, answer FROM unnest($2::int[], $3::respuesta_criterio[]) AS t(item, answer)`,
            [id, content.answers.map(a => a.itemId), content.answers.map(a => a.answer)]);
        return id;
    }
}
