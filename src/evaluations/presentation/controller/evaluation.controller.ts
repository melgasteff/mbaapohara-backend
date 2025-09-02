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
}