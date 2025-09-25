import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/count.use-case";
import { CreateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/create.use-case";
import { DeleteEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/delete.use-case";
import { GetAllEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/get-all.use-case";
import { GetEvaluationByIdUseCase } from "src/evaluations/application/use-case/evaluation/get-by-id.use-case";
import { UpdateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/update.use-case";
import { GlobalExceptionFilter } from "src/evaluations/infrastructure/exception-filter/evaluation.exception-filter";
import { EvaluationDTOMapper } from "../mapper/evaluation-dto.mapper";
import { NewEvaluationDTO } from "../dto/new-evaluation.dto";
import { EvaluationDTO } from "../dto/evaluation.dto";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";
import { EvaluationDetailDTO } from "../dto/evaluation-detail.dto";
import { NewEvaluationDetailDTO } from "../dto/new-evaluation-detail.dto";
import { CreateEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/create.use-case";
import { UpdateEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/update.use-case";
import { DeleteEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/delete.use-case";
import { GetEvaluationDetailByIdUseCase } from "src/evaluations/application/use-case/evaluation-detail/get-by-id.use-case";
import { GetAllEvaluationDetailsUseCase } from "src/evaluations/application/use-case/evaluation-detail/get-all.use-case";
import { CountEvaluationDetailsUseCase } from "src/evaluations/application/use-case/evaluation-detail/count.use-case";
import { EvaluationDetailDTOMapper } from "../mapper/evaluation-detail-dto.mapper";
import { privateDecrypt } from "crypto";
import { CreateReasonDetailUseCase } from "src/evaluations/application/use-case/reason-detail/create.use-case";
import { DeleteReasonDetailUseCase } from "src/evaluations/application/use-case/reason-detail/delete.use-case";
import { GetReasonDetailByIdUseCase } from "src/evaluations/application/use-case/reason-detail/get-by-id.use-case";
import { GetAllReasonDetailsUseCase } from "src/evaluations/application/use-case/reason-detail/get-all.use-case";
import { CountReasonDetailsUseCase } from "src/evaluations/application/use-case/reason-detail/count.use-case";
import { ReasonDetailDTOMapper } from "../mapper/reason-detail-dto.mapper";
import { ReasonDetailDTO } from "../dto/reason-detail.dto";


@UseFilters(GlobalExceptionFilter)
@Controller('evaluation')
export class EvaluationController {
    constructor(
        private readonly createEvaluationUC: CreateEvaluationUseCase,
        private readonly updateEvaluationUC: UpdateEvaluationUseCase,
        private readonly deleteEvaluationUC: DeleteEvaluationUseCase,
        private readonly getEvaluationByIdUC: GetEvaluationByIdUseCase,
        private readonly getAllEvaluationUC: GetAllEvaluationsUseCase,
        private readonly countEvaluationUC: CountEvaluationsUseCase,
        //Evaluation Detail
        private readonly createEvaluationDetailUC: CreateEvaluationDetailUseCase,
        private readonly updateEvaluationDetailUC: UpdateEvaluationDetailUseCase,
        private readonly deleteEvaluationDetailUC: DeleteEvaluationDetailUseCase,
        private readonly getEvaluationDetailByIdUC: GetEvaluationDetailByIdUseCase,
        private readonly getAllEvaluationDetailUC: GetAllEvaluationDetailsUseCase,
        private readonly countEvaluationDetailUC: CountEvaluationDetailsUseCase,

        //ReasonDetail
        private readonly createReasonDetailUC: CreateReasonDetailUseCase,
        private readonly deleteReasonDetailUC: DeleteReasonDetailUseCase,
        private readonly getReasonDetailByIdUC: GetReasonDetailByIdUseCase,
        private readonly getAllReasonDetailsUC: GetAllReasonDetailsUseCase,
        private readonly countReasonDetailsUC: CountReasonDetailsUseCase
    ) { }

    @Post()
    async createEvauation(@Body() evaluationDto: NewEvaluationDTO): Promise<EvaluationDTO> {
        const newEvaluation = await this.createEvaluationUC.execute({ ...evaluationDto });
        return EvaluationDTOMapper.toDTO(newEvaluation)
    }

    @Get()
    async getAllEvaluations(): Promise<ResponseModel<EvaluationDTO>> {
        const evaluationDto = (await this.getAllEvaluationUC.execute()).map(evaluation => EvaluationDTOMapper.toDTO(evaluation));
        return {
            count: await this.countEvaluationUC.execute(),
            data: evaluationDto
        }
    }

    @Get(':id')
    async getEvaluationById(@Param('id', ParseIntPipe) id: number): Promise<EvaluationDTO> {
        return EvaluationDTOMapper.toDTO(await this.getEvaluationByIdUC.execute(id));
    }

    @Put(':id')
    async updateEvaluation(@Param('id', ParseIntPipe) id: number, @Body() evaluation: EvaluationDTO): Promise<EvaluationDTO> {
        const updatedEvaluation = await this.updateEvaluationUC.execute({ ...evaluation });
        return EvaluationDTOMapper.toDTO(updatedEvaluation)
    }

    @Delete(':id')
    deleteEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteEvaluationUC.execute(id);
    }

    //Evaluation Detail
    @Post(':evaluationId/details')
    async createEvaluationDetail(
        @Param('evaluationId', ParseIntPipe) evaluationId: number,
        @Body() evaluationDetailDto: NewEvaluationDetailDTO
    ): Promise<EvaluationDetailDTO> {
        const newEvaluationDetail = await this.createEvaluationDetailUC.execute({
            ...evaluationDetailDto,
            idevaluation: evaluationId,
        });
        return EvaluationDetailDTOMapper.toDTO(newEvaluationDetail);
    }

    @Get(':evaluationId/details')
    async getAllEvaluationDetails(
        @Param('evaluationId', ParseIntPipe) evaluationId: number
    ): Promise<ResponseModel<EvaluationDetailDTO>> {
        const evaluationDetailDto = (await this.getAllEvaluationDetailUC.execute(evaluationId))
            .map(evaluationDetail => EvaluationDetailDTOMapper.toDTO(evaluationDetail));
        return {
            count: await this.countEvaluationDetailUC.execute(),
            data: evaluationDetailDto
        };
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

    //Reason Detail

    @Post(':evaluationId/reason-details')
    async createReasonDetail(
        @Param('evaluationDetailId', ParseIntPipe) evaluationDetailId: number,
        @Body() reasonDetailDto: ReasonDetailDTO
    ): Promise<ReasonDetailDTO> {
        const reasonDetail = await this.createReasonDetailUC.execute({
            idEvaluationDetail: evaluationDetailId,
            idReason: reasonDetailDto.idReason,
        });
        return ReasonDetailDTOMapper.toDTO(reasonDetail);
    }

    @Get(':evaluationId/reason-details/:reasonId')
    async getReasonDetail(
        @Param('evaluationId', ParseIntPipe) evaluationId: number,
        @Param('reasonId', ParseIntPipe) reasonId: number
    ): Promise<ResponseModel<ReasonDetailDTO>> {
        const reasonDetails = (await this.getAllReasonDetailsUC.execute(evaluationId, reasonId))
            .map(reasonDetail => ReasonDetailDTOMapper.toDTO(reasonDetail));

        return {
            count: await this.countReasonDetailsUC.execute(),
            data: reasonDetails
        };
    }

    @Delete(':evaluationId/reason-details/:reasonId')
    async deleteReasonDetail(
        @Param('evaluationId', ParseIntPipe) evaluationId: number,
        @Param('reasonId', ParseIntPipe) reasonId: number
    ): Promise<void> {
        return this.deleteReasonDetailUC.execute(evaluationId, reasonId);
    }

}