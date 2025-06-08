import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";

import { GlobalExceptionFilter } from "src/evaluations/infrastructure/exception-filter/salary-evaluation/salary.exception-filter";
import { NewSalaryEvaluationDTO } from "../dto/new-salary-evaluation.dto";
import { SalaryEvaluationDTOMapper } from "../mapper/salary-evaluation-dto.mapper";
import { SalaryEvaluationDTO } from "../dto/salary-evaluation.dto";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";
import { SalaryEvaluationMapper } from "src/evaluations/infrastructure/mapper/salary-evaluation.mapper";
import { CreateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/create.use-case";
import { UpdateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/update.use-case";
import { DeleteSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/delete.use-case";
import { GetSalaryEvaluationByIdUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-by-id.use-case";
import { GetAllSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-all.use-case";
import { CountSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/count.use-case";

@UseFilters(GlobalExceptionFilter)
@Controller('evaluation/salary')
export class SalaryEvaluationController {
    constructor(
        private readonly createSalaryEvlUC: CreateSalaryEvaluationUseCase,
        private readonly updateSalaryEvlUC: UpdateSalaryEvaluationUseCase,
        private readonly deleteSalaryEvlUC: DeleteSalaryEvaluationUseCase,
        private readonly getSalaryEvlByIdUC: GetSalaryEvaluationByIdUseCase,
        private readonly getAllSalaryEvlUC: GetAllSalaryEvaluationsUseCase,
        private readonly countSalaryEvlUC: CountSalaryEvaluationsUseCase
    ) { }

    @Post(':idEvaluacion')
    async createSalaryEvaluation(
        @Param('idEvaluacion', ParseIntPipe) idEvaluacion: number,
        @Body() salaryEvl: NewSalaryEvaluationDTO): Promise<SalaryEvaluationDTO> {
        const salaryEvaluation = await this.createSalaryEvlUC.execute(
            idEvaluacion,
            salaryEvl.base,
            salaryEvl.experienciaArea,
            salaryEvl.experienciaEmpresa,
            salaryEvl.bono,
            salaryEvl.comision,
            salaryEvl.propina,
            salaryEvl.moneda,
            salaryEvl.frecuencia,
            salaryEvl.modalidad
        )
        return SalaryEvaluationDTOMapper.toDTO(salaryEvaluation)
    }

    @Get()
    async getAllSalaryEvaluations(): Promise<ResponseModel<SalaryEvaluationDTO>> {
        const salaryEvalDto = (await this.getAllSalaryEvlUC.execute()).map(salaryEval => SalaryEvaluationDTOMapper.toDTO(salaryEval));
        return {
            count: await this.countSalaryEvlUC.execute(),
            data: salaryEvalDto
        }
    }

    @Get(':id')
    async getSalaryEvaluationById(@Param('id', ParseIntPipe) id: number): Promise<SalaryEvaluationDTO> {
        return SalaryEvaluationDTOMapper.toDTO(await this.getSalaryEvlByIdUC.execute(id));
    }

    @Put(':id')
    async updateSalaryEvaluation(@Param('id', ParseIntPipe) id: number, @Body() salaryEvl: SalaryEvaluationDTO): Promise<SalaryEvaluationDTO> {

        const updatedSalaryEvaluation = await this.updateSalaryEvlUC.execute(
            id,
            salaryEvl.base,
            salaryEvl.experienciaArea,
            salaryEvl.experienciaEmpresa,
            salaryEvl.bono,
            salaryEvl.comision,
            salaryEvl.propina,
            salaryEvl.moneda,
            salaryEvl.frecuencia,
            salaryEvl.modalidad
        )
        return SalaryEvaluationDTOMapper.toDTO(updatedSalaryEvaluation);
    }

    @Delete(':id')
    deleteSalaryEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteSalaryEvlUC.execute(id);
    }
}