import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Page, PageRequest, pageOffset } from 'src/shared/domain/page';
import { isUniqueViolation } from 'src/shared/infrastructure/database/pg-errors';
import { ReportAlreadyExistsException } from '../../application/exception/review.exceptions';
import { ReportCategory, ReportedReview, ReportStatus } from '../../domain/model/report';
import { ReportRepository } from '../../domain/port/report-repository.port';

/** Adaptador de ReportRepository con SQL sobre la tabla `reportes` (migración 1795600000000). */
@Injectable()
export class SqlReportRepository extends ReportRepository {
    constructor(private readonly dataSource: DataSource) {
        super();
    }

    async create(reviewId: number, userId: number, category: ReportCategory, comment: string | null): Promise<void> {
        try {
            await this.dataSource.query(
                'INSERT INTO reportes (id_resena, id_usuario, categoria, comentario) VALUES ($1, $2, $3, $4)',
                [reviewId, userId, category, comment]);
        } catch (error) {
            // Un reporte por cuenta y reseña: lo garantiza la restricción UNIQUE.
            if (isUniqueViolation(error)) throw new ReportAlreadyExistsException();
            throw error;
        }
    }

    async listPending(request: PageRequest): Promise<Page<ReportedReview>> {
        // Sin id_usuario de quien reportó ni del autor de la reseña.
        const [data, [{ total }]] = await Promise.all([
            this.dataSource.query(
                `SELECT r.id AS "idResena",
                        json_build_object('id', e.id, 'nombre', e.nombre) AS empresa,
                        json_build_object('id', s.id, 'nombre', s.nombre, 'ciudad', ci.nombre) AS local,
                        (r.id_version_publicada IS NOT NULL) AS publicada,
                        v.calificacion, v.lo_bueno AS "loBueno", v.a_mejorar AS "aMejorar",
                        count(*)::int AS cantidad, min(rp.fecha) AS "primerReporte",
                        json_agg(json_build_object('categoria', rp.categoria, 'comentario', rp.comentario, 'fecha', rp.fecha)
                                 ORDER BY rp.fecha) AS reportes
                 FROM reportes rp
                 JOIN resenas r ON r.id = rp.id_resena
                 JOIN sucursales s ON s.id = r.id_sucursal
                 JOIN empresas e ON e.id = s.id_empresa
                 JOIN ciudades ci ON ci.id = s.id_ciudad
                 LEFT JOIN versiones_resena v ON v.id = r.id_version_publicada
                 WHERE rp.estado = 'pendiente'
                 GROUP BY r.id, e.id, s.id, ci.nombre, v.id
                 ORDER BY min(rp.fecha), r.id
                 LIMIT $1 OFFSET $2`,
                [request.pageSize, pageOffset(request)]),
            this.dataSource.query(`SELECT count(DISTINCT id_resena)::int AS total FROM reportes WHERE estado = 'pendiente'`),
        ]);
        return { data, total, page: request.page, pageSize: request.pageSize };
    }

    async resolvePending(reviewId: number, status: ReportStatus.Kept | ReportStatus.Retired, adminId: number): Promise<number> {
        const [, affected] = await this.dataSource.query(
            `UPDATE reportes SET estado = $2, id_administrador = $3, fecha_decision = now()
             WHERE id_resena = $1 AND estado = 'pendiente'`,
            [reviewId, status, adminId]);
        return affected;
    }
}
