import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/auth/domain/model/auth-account';
import { CurrentUser, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { mapPage } from 'src/shared/domain/page';
import { UserRole } from 'src/shared/domain/user-role';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { DecideReviewUseCase, ListModerationQueueUseCase } from '../application/use-case/moderation-queue.use-case';
import { ReviewExceptionFilter } from '../infrastructure/exception-filter/review.exception-filter';
import { DecisionResultDTO, QueuePageDTO, RejectVersionDTO } from './dto/moderation-queue.dto';
import { toQueueItemDTO } from './review-dto.mapper';

// Revisión humana (política de moderación, sección 6), solo para administradores. Vive en `reviews` porque cambia el
// estado de la reseña; `moderation` registra la decisión.
@ApiTags('Moderación')
@Roles(UserRole.Admin)
@UseFilters(ReviewExceptionFilter)
@Controller('moderation/queue')
export class ModerationQueueController {
    constructor(private readonly listUC: ListModerationQueueUseCase, private readonly decideUC: DecideReviewUseCase) { }

    /** Versiones en revisión, la más antigua primero, con las señales de la moderación automática. Sin el autor. */
    @Get()
    async list(@Query() query: PaginationQueryDTO): Promise<QueuePageDTO> {
        return mapPage(await this.listUC.execute(query), toQueueItemDTO);
    }

    /** Publica la versión: pasa a ser la que se ve de la reseña. */
    @Patch(':idVersion/publish')
    publish(@CurrentUser() admin: AuthenticatedUser, @Param('idVersion', ParseIntPipe) id: number): Promise<DecisionResultDTO> {
        return this.decideUC.publish(admin.id, id);
    }

    /** Rechaza la versión con una categoría y el motivo que lee quien escribió; si había una publicada, sigue esa. */
    @Patch(':idVersion/reject')
    reject(
        @CurrentUser() admin: AuthenticatedUser, @Param('idVersion', ParseIntPipe) id: number, @Body() body: RejectVersionDTO,
    ): Promise<DecisionResultDTO> {
        return this.decideUC.reject(admin.id, id, body.categoria, body.motivo);
    }
}
