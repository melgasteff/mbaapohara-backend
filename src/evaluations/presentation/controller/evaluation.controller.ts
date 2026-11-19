import { ApiTags } from "@nestjs/swagger";
import { Body, Query, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { mapPage, Page } from "src/shared/domain/page";
import { PaginationQueryDTO } from "src/shared/infrastructure/rest/pagination-query.dto";
import { CreateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/create.use-case";
import { DeleteEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/delete.use-case";
import { GetAllEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/get-all.use-case";
import { GetEvaluationByIdUseCase } from "src/evaluations/application/use-case/evaluation/get-by-id.use-case";
import { UpdateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/update.use-case";
import { GlobalExceptionFilter } from "src/evaluations/infrastructure/exception-filter/evaluation.exception-filter";
import { EvaluationDTOMapper } from "../mapper/evaluation-dto.mapper";
import { NewEvaluationDTO } from "../dto/new-evaluation.dto";
import { EvaluationDTO } from "../dto/evaluation.dto";
import { EvaluationDetailDTO } from "../dto/evaluation-detail.dto";
import { NewEvaluationDetailDTO } from "../dto/new-evaluation-detail.dto";
import { CreateEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/create.use-case";
import { UpdateEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/update.use-case";
import { DeleteEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/delete.use-case";
import { GetEvaluationDetailByIdUseCase } from "src/evaluations/application/use-case/evaluation-detail/get-by-id.use-case";
import { GetAllEvaluationDetailsUseCase } from "src/evaluations/application/use-case/evaluation-detail/get-all.use-case";
import { EvaluationDetailDTOMapper } from "../mapper/evaluation-detail-dto.mapper";
import { EvaluationResponseDTO } from "../dto/evaluation-response.dto";
import { EvaluationDetailResponseDTO } from "../dto/evaluation-detail-response.dto";


@UseFilters(GlobalExceptionFilter)
@ApiTags('Evaluaciones')
@Controller('evaluation')
export class EvaluationController {
    constructor(
        private readonly createEvaluationUC: CreateEvaluationUseCase,
        private readonly updateEvaluationUC: UpdateEvaluationUseCase,
        private readonly deleteEvaluationUC: DeleteEvaluationUseCase,
        private readonly getEvaluationByIdUC: GetEvaluationByIdUseCase,
        private readonly getAllEvaluationUC: GetAllEvaluationsUseCase,
        //Evaluation Detail
        private readonly createEvaluationDetailUC: CreateEvaluationDetailUseCase,
        private readonly updateEvaluationDetailUC: UpdateEvaluationDetailUseCase,
        private readonly deleteEvaluationDetailUC: DeleteEvaluationDetailUseCase,
        private readonly getEvaluationDetailByIdUC: GetEvaluationDetailByIdUseCase,
        private readonly getAllEvaluationDetailUC: GetAllEvaluationDetailsUseCase
    ) { }

    @Post()
    async createEvauation(@Body() evaluationDto: NewEvaluationDTO): Promise<EvaluationDTO> {
        const newEvaluation = await this.createEvaluationUC.execute({ ...evaluationDto });
        return EvaluationDTOMapper.toDTO(newEvaluation)
    }

    @Get()
    async getAllEvaluations(@Query() query: PaginationQueryDTO): Promise<Page<EvaluationResponseDTO>> {
        return mapPage(await this.getAllEvaluationUC.execute(query), evaluation => EvaluationDTOMapper.toDTOResponse(evaluation));
    }

    @Get(':id')
    async getEvaluationById(@Param('id', ParseIntPipe) id: number): Promise<EvaluationDTO> {
        return EvaluationDTOMapper.toDTO(await this.getEvaluationByIdUC.execute(id));
    }

    @Put(':id')
    async updateEvaluation(@Param('id', ParseIntPipe) id: number, @Body() evaluation: EvaluationDTO): Promise<EvaluationDTO> {
        const updatedEvaluation = await this.updateEvaluationUC.execute({ ...evaluation, 
            id: id
         });
        return EvaluationDTOMapper.toDTO(updatedEvaluation)
    }

    @Delete(':id')
    deleteEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteEvaluationUC.execute(id);
    }

    @Post(':evaluationId/details')
    async createEvaluationDetails(
        @Param('evaluationId', ParseIntPipe) evaluationId: number,
        @Body() evaluationDetailDtos: NewEvaluationDetailDTO[]
    ): Promise<EvaluationDetailDTO[]> {
        const savedDetails = [];

        for (const detailDto of evaluationDetailDtos) {
            const newDetail = await this.createEvaluationDetailUC.execute({
                ...detailDto,
                idevaluation: evaluationId,
            });
            savedDetails.push(EvaluationDetailDTOMapper.toDTO(newDetail));
        }

        return savedDetails;
    }

    @Get(':evaluationId/details')
    async getAllEvaluationDetails(
        @Param('evaluationId', ParseIntPipe) evaluationId: number,
        @Query() query: PaginationQueryDTO
    ): Promise<Page<EvaluationDetailResponseDTO>> {
        return mapPage(await this.getAllEvaluationDetailUC.execute(evaluationId, query),
            evaluationDetail => EvaluationDetailDTOMapper.toDTOResponse(evaluationDetail));
    }

    @Put(':evaluationId/details/:id')
    async updateEvaluationDetail(
        @Param('evaluationId', ParseIntPipe) evaluationId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() evaluationDetail: EvaluationDetailDTO
    ): Promise<EvaluationDetailDTO> {
        const updatedEvaluationDetail = await this.updateEvaluationDetailUC.execute({
            ...evaluationDetail,
            idevaluation: evaluationId
        });
        return EvaluationDetailDTOMapper.toDTO(updatedEvaluationDetail);
    }

    @Delete(':evaluationId/details/:id')
    deleteEvaluationDetail(
        @Param('evaluationId', ParseIntPipe) evaluationId: number,
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        return this.deleteEvaluationDetailUC.execute(id);
    }

}
