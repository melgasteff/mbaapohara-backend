import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/auth/domain/model/auth-account';
import { CurrentUser, Public } from 'src/auth/presentation/decorator/auth.decorators';
import { mapPage } from 'src/shared/domain/page';
import { DeleteReviewUseCase } from '../application/use-case/delete-review.use-case';
import { EditReviewUseCase } from '../application/use-case/edit-review.use-case';
import { PublishReviewUseCase } from '../application/use-case/publish-review.use-case';
import { GetPublicReviewUseCase, ListMyReviewsUseCase, ListPublicReviewsUseCase } from '../application/use-case/query-reviews.use-case';
import { ReportReviewUseCase } from '../application/use-case/reports.use-case';
import { ReportReceivedDTO, ReportReviewDTO } from './dto/report.dto';
import { ReviewExceptionFilter } from '../infrastructure/exception-filter/review.exception-filter';
import { MyReviewDTO, PublicReviewDTO, PublicReviewPageDTO, SubmitResultDTO } from './dto/review-response.dto';
import { EditReviewDTO, PublishReviewDTO, ReviewsQueryDTO } from './dto/review.dto';
import { toFilters, toMyReviewDTO, toPublicReviewDTO, toReviewInput, toSubmitResultDTO } from './review-dto.mapper';

@ApiTags('Reseñas')
@UseFilters(ReviewExceptionFilter)
@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly publishUC: PublishReviewUseCase,
        private readonly editUC: EditReviewUseCase,
        private readonly deleteUC: DeleteReviewUseCase,
        private readonly listMineUC: ListMyReviewsUseCase,
        private readonly listPublicUC: ListPublicReviewsUseCase,
        private readonly getPublicUC: GetPublicReviewUseCase,
        private readonly reportUC: ReportReviewUseCase,
    ) { }

    /** Reseñas publicadas, filtrables por empresa, local, cargo, ciudad, contrato, modalidad y situación (RF5). */
    @Public()
    @Get()
    async list(@Query() query: ReviewsQueryDTO): Promise<PublicReviewPageDTO> {
        return mapPage(await this.listPublicUC.execute(toFilters(query), query), toPublicReviewDTO);
    }

    /** Mis reseñas: la última versión de cada una, con su estado y el motivo de la moderación. */
    // Se declara antes de `:id`: si no, «mine» se leería como id.
    @Get('mine')
    async mine(@CurrentUser() user: AuthenticatedUser): Promise<MyReviewDTO[]> {
        return (await this.listMineUC.execute(user.id)).map(toMyReviewDTO);
    }

    /** Una reseña publicada. */
    @Public()
    @Get(':id')
    async get(@Param('id', ParseIntPipe) id: number): Promise<PublicReviewDTO> {
        return toPublicReviewDTO(await this.getPublicUC.execute(id));
    }

    /** Publica una reseña: se modera al instante y responde publicada, en revisión o rechazada con el motivo. */
    @Post()
    async publish(@CurrentUser() user: AuthenticatedUser, @Body() body: PublishReviewDTO): Promise<SubmitResultDTO> {
        return toSubmitResultDTO(await this.publishUC.execute(user.id, body.idLocal, toReviewInput(body)));
    }

    /** Reporta una reseña publicada que rompe las reglas. Sigue visible mientras se revisa. */
    @Post(':id/reports')
    async report(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseIntPipe) id: number, @Body() body: ReportReviewDTO): Promise<ReportReceivedDTO> {
        await this.reportUC.execute(user.id, id, body.categoria, body.comentario ?? null);
        return { mensaje: 'Gracias. Vamos a revisar la reseña; mientras tanto sigue visible.' };
    }

    /** Edita una reseña propia. La versión publicada sigue visible hasta que la nueva se publique. */
    @Put(':id')
    async edit(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseIntPipe) id: number, @Body() body: EditReviewDTO): Promise<SubmitResultDTO> {
        return toSubmitResultDTO(await this.editUC.execute(user.id, id, toReviewInput(body)));
    }

    /** Borra una reseña propia con todas sus versiones. */
    @Delete(':id')
    @HttpCode(204)
    async remove(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteUC.execute(user.id, id);
    }
}
