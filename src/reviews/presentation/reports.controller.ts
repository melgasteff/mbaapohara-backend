import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/auth/domain/model/auth-account';
import { CurrentUser, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { KeepReportedReviewUseCase, ListReportsUseCase, RetireReviewUseCase } from '../application/use-case/reports.use-case';
import { ReviewExceptionFilter } from '../infrastructure/exception-filter/review.exception-filter';
import { RejectVersionDTO } from './dto/moderation-queue.dto';
import { ReportedReviewPageDTO, ReportsClosedDTO, RetiredDTO } from './dto/report.dto';

// Reportes y retiro de reseñas publicadas (política de moderación, sección 8), solo para administradores.
@ApiTags('Moderación')
@Roles(UserRole.Admin)
@UseFilters(ReviewExceptionFilter)
@Controller('moderation')
export class ReportsController {
    constructor(
        private readonly listUC: ListReportsUseCase,
        private readonly keepUC: KeepReportedReviewUseCase,
        private readonly retireUC: RetireReviewUseCase,
    ) { }

    /** Reseñas con reportes pendientes, agrupados, la del reporte más antiguo primero. */
    @Get('reports')
    list(@Query() query: PaginationQueryDTO): Promise<ReportedReviewPageDTO> {
        return this.listUC.execute(query);
    }

    /** La reseña cumple las reglas: se cierran sus reportes y sigue publicada. */
    @Patch('reviews/:idResena/keep')
    keep(@CurrentUser() admin: AuthenticatedUser, @Param('idResena', ParseIntPipe) id: number): Promise<ReportsClosedDTO> {
        return this.keepUC.execute(admin.id, id);
    }

    /** Retira una reseña publicada que incumple las reglas, con la categoría y el motivo que lee quien la escribió. */
    @Patch('reviews/:idResena/retire')
    retire(
        @CurrentUser() admin: AuthenticatedUser, @Param('idResena', ParseIntPipe) id: number, @Body() body: RejectVersionDTO,
    ): Promise<RetiredDTO> {
        return this.retireUC.execute(admin.id, id, body.categoria, body.motivo);
    }
}
