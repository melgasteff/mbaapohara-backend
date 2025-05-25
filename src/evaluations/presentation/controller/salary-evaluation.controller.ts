import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/count.use-case";
import { CreateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/create.use-case";
import { DeleteSalaryEvaluationUseCase } from "src/evaluations/application/use-case/delete.use-case";
import { GetAllSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/get-all.use-case";
import { GetSalaryEvaluationByIdUseCase } from "src/evaluations/application/use-case/get-by-id.use-case";
import { UpdateSalaryEvaluatonUseCase } from "src/evaluations/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/evaluations/infrastructure/exception-filter/exception-filter";
import { NewSalaryEvaluationDTO } from "../dto/new-salary-evaluation.dto";
import { SalaryEvaluationDTOMapper } from "../mapper/salary-evaluation-dto.mapper";
import { SalaryEvaluationDTO } from "../dto/salary-evaluation.dto";
import { ResponseModel } from "src/shared/infrasctructure/rest/response-model.dto";
import { SalaryEvaluationMapper } from "src/evaluations/infrastructure/mapper/salary-evaluation.mapper";

@UseFilters(GlobalExceptionFilter)
@Controller('salary')
export class SalaryEvaluationController {
    constructor(
        private readonly createSalaryEvlUC: CreateSalaryEvaluationUseCase,
        private readonly updateSalaryEvlUC: UpdateSalaryEvaluatonUseCase,
        private readonly deleteSalaryEvlUC: DeleteSalaryEvaluationUseCase,
        private readonly getSalaryEvlByIdUC: GetSalaryEvaluationByIdUseCase,
        private readonly getAllSalaryEvlUC: GetAllSalaryEvaluationsUseCase,
        private readonly countSalaryEvlUC: CountSalaryEvaluationsUseCase
    ) { }

    @Post()
    async createSalaryEvaluation(@Body() salaryEvl: NewSalaryEvaluationDTO): Promise<SalaryEvaluationDTO> {
        const salaryEvaluation = await this.createSalaryEvlUC.execute(
            salaryEvl.idjob,
            salaryEvl.iduser,
            salaryEvl.idcompany,
            salaryEvl.idoffice,
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
        //console.log(await this.getAllSalaryEvlUC.execute())
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
        
        const updatedOffice = await this.updateSalaryEvlUC.execute(
            id,
            salaryEvl.idjob,
            salaryEvl.iduser,
            salaryEvl.idcompany,
            salaryEvl.idoffice,
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
        return SalaryEvaluationDTOMapper.toDTO(updatedOffice);
    }

    @Delete(':id')
    deleteSalaryEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.deleteSalaryEvlUC.execute(id);
    }
}