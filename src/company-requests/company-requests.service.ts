import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { ReviewNotFoundException } from 'src/reviews/application/exception/review.exceptions';
import { GetPublicReviewUseCase } from 'src/reviews/application/use-case/query-reviews.use-case';
import { Page, PageRequest, pageOffset } from 'src/shared/domain/page';
import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { CompanyRequest, RequestStatus, RequestType } from './company-request.entity';
import { CompanyRequestDTO, CreateCompanyRequestDTO } from './dto/company-request.dto';

// Módulo liviano (docs/arquitectura.md): solicitudes de empresas (política de moderación, sección 8). Retirar una
// reseña a pedido de una empresa usa el mismo retiro que los reportes (reviews), con la misma política.
@Injectable()
export class CompanyRequestsService {
    constructor(
        @InjectRepository(CompanyRequest) private readonly repo: Repository<CompanyRequest>,
        private readonly companies: CompaniesService,
        private readonly publicReview: GetPublicReviewUseCase,
        private readonly dataSource: DataSource,
    ) { }

    async create(data: CreateCompanyRequestDTO): Promise<void> {
        const target = data.tipo === RequestType.ReviewRevision ? await this.reviewTarget(data.idResena) : await this.companyTarget(data.idEmpresa);
        await this.repo.insert({
            tipo: data.tipo,
            idResena: target.idResena,
            idEmpresa: target.idEmpresa,
            nombre: data.nombre,
            correo: data.correo,
            mensaje: data.mensaje,
        });
    }

    async findPage(request: PageRequest, estado?: RequestStatus): Promise<Page<CompanyRequestDTO>> {
        const where = estado ? 'WHERE se.estado = $3' : '';
        const params: unknown[] = [request.pageSize, pageOffset(request), ...(estado ? [estado] : [])];
        const [data, [{ total }]] = await Promise.all([
            this.dataSource.query(
                `SELECT se.id, se.tipo, se.estado, se.nombre, se.correo, se.mensaje, se.respuesta, se.fecha,
                        se.fecha_respuesta AS "fechaRespuesta",
                        CASE WHEN e.id IS NULL THEN NULL ELSE json_build_object('id', e.id, 'nombre', e.nombre) END AS empresa,
                        CASE WHEN se.id_resena IS NULL THEN NULL ELSE json_build_object(
                            'id', se.id_resena, 'publicada', v.id IS NOT NULL, 'loBueno', v.lo_bueno, 'aMejorar', v.a_mejorar) END AS resena
                 FROM solicitudes_empresa se
                 LEFT JOIN empresas e ON e.id = se.id_empresa
                 LEFT JOIN resenas r ON r.id = se.id_resena
                 LEFT JOIN versiones_resena v ON v.id = r.id_version_publicada
                 ${where}
                 ORDER BY se.estado = 'pendiente' DESC, se.fecha
                 LIMIT $1 OFFSET $2`,
                params),
            this.dataSource.query(`SELECT count(*)::int AS total FROM solicitudes_empresa se ${where.replace('$3', '$1')}`, estado ? [estado] : []),
        ]);
        return { data, total, page: request.page, pageSize: request.pageSize };
    }

    /** Registra la respuesta (enviada por correo a mano) y borra el nombre y el correo (decisión del 21/11). */
    async answer(id: number, adminId: number, respuesta: string): Promise<void> {
        const [rows] = await this.dataSource.query(
            `UPDATE solicitudes_empresa
             SET estado = 'respondida', respuesta = $2, id_administrador = $3, fecha_respuesta = now(), nombre = NULL, correo = NULL
             WHERE id = $1 AND estado = 'pendiente' RETURNING id`,
            [id, respuesta, adminId]);
        if (rows.length) return;
        if (await this.repo.existsBy({ id })) throw new ConflictException(`La solicitud ${id} ya fue respondida`);
        throw new NotFoundException(`No existe la solicitud ${id}`);
    }

    private async reviewTarget(idResena?: number): Promise<{ idResena: number; idEmpresa: number }> {
        if (!idResena) throw new BadRequestException('Indicá la reseña que querés que revisemos');
        try {
            const review = await this.publicReview.execute(idResena);
            return { idResena: review.id, idEmpresa: review.empresa.id };
        } catch (error) {
            if (error instanceof ReviewNotFoundException) throw new BadRequestException('Esa reseña no existe o ya no está publicada');
            throw error;
        }
    }

    private async companyTarget(idEmpresa?: number): Promise<{ idResena: null; idEmpresa: number }> {
        if (!idEmpresa) throw new BadRequestException('Indicá la empresa');
        try {
            const company = await this.companies.findOne(idEmpresa);
            if (company.estado !== ProposalStatus.Approved) throw new NotFoundException();
            return { idResena: null, idEmpresa: company.id };
        } catch (error) {
            if (error instanceof NotFoundException) throw new BadRequestException(`No existe la empresa ${idEmpresa}`);
            throw error;
        }
    }
}
