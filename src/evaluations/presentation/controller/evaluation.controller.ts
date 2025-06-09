import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/count.use-case";
import { CreateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/create.use-case";
import { DeleteEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/delete.use-case";
import { GetAllEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/get-all.use-case";
import { GetEvaluationByIdUseCase } from "src/evaluations/application/use-case/evaluation/get-by-id.use-case";
import { UpdateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/update.use-case";
import { GlobalExceptionFilter } from "src/evaluations/infrastructure/exception-filter/evaluation/evaluation.exception-filter";
import { NewEvaluationDTO } from "../dto/new-evaluation.dto";
import { EvaluationDTO } from "../dto/evaluation.dto";
import { SalaryEvaluationDTOMapper } from "../mapper/salary-evaluation-dto.mapper";
import { EvaluationDTOMapper } from "../mapper/evaluation-dto.mapper";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";
import { BenefitEvaluationDTO } from "../dto/benefit-evaluation.dto";
import { CountSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/count.use-case";
import { CreateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/create.use-case";
import { DeleteSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/delete.use-case";
import { GetAllSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-all.use-case";
import { GetSalaryEvaluationByIdUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-by-id.use-case";
import { UpdateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/update.use-case";
import { SalaryEvaluationDTO } from "../dto/salary-evaluation.dto";
import { NewSalaryEvaluationDTO } from "../dto/new-salary-evaluation.dto";
import { SetBenefitEvaluationUseCase } from "src/evaluations/application/use-case/benefit-evaluation/set-benefit-evaluation.use-case";
import { NewBenefitEvaluationDTO } from "../dto/new-benefit-evaluation.dto";
import { GetAllBenefitEvaluationsUseCase } from "src/evaluations/application/use-case/benefit-evaluation/get-all.use-case";

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
        private readonly createSalaryEvlUC: CreateSalaryEvaluationUseCase,
        private readonly updateSalaryEvlUC: UpdateSalaryEvaluationUseCase,
        private readonly deleteSalaryEvlUC: DeleteSalaryEvaluationUseCase,
        private readonly getSalaryEvlByIdUC: GetSalaryEvaluationByIdUseCase,
        private readonly getAllSalaryEvlUC: GetAllSalaryEvaluationsUseCase,
        private readonly countSalaryEvlUC: CountSalaryEvaluationsUseCase,
        private readonly createBenefitEvlUC: SetBenefitEvaluationUseCase,
        private readonly getAllBenefitEvlUC: GetAllBenefitEvaluationsUseCase
    ) { }

    @Get(':idEvaluacion/benefit')
    async getBenefitEvaluation(
        @Param('idEvaluacion', ParseIntPipe) idEvaluacion: number
    ): Promise<BenefitEvaluationDTO>{
        const benefits = await this.getAllBenefitEvlUC.execute(idEvaluacion);
        return {
            idEvaluacion: idEvaluacion,
            beneficios: benefits.map(benefit => ({
              id: benefit.getId(),
              descripcion: benefit.getDescripcion(),
              contratos: benefit.getContratos().map(contract => ({
                    id: contract.getId(),
                    descripcion: contract.getTipoContrato()
                }))  
            }))
        }
    }

    @Post(':idEvaluacion/benefit')
    async createBenefitEvaluation(
        @Param('idEvaluacion', ParseIntPipe) idEvaluacion: number,
        @Body() dto: NewBenefitEvaluationDTO
    ): Promise<BenefitEvaluationDTO> {
        const evaluation = await this.createBenefitEvlUC.execute(
            idEvaluacion,
            dto.beneficios
        );
        return {
            idEvaluacion: idEvaluacion,
            beneficios: evaluation.benefits.map(benefit => ({
                id: benefit.getId(),
                descripcion: benefit.getDescripcion(),
                contratos: benefit.getContratos().map(contract => ({
                    id: contract.getId(),
                    descripcion: contract.getTipoContrato()
                }))
            }))
        };
    }

    @Post('salary/:idEvaluacion')
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

    @Get('salary')
    async getAllSalaryEvaluations(): Promise<ResponseModel<SalaryEvaluationDTO>> {
        const salaryEvalDto = (await this.getAllSalaryEvlUC.execute()).map(salaryEval => SalaryEvaluationDTOMapper.toDTO(salaryEval));
        return {
            count: await this.countSalaryEvlUC.execute(),
            data: salaryEvalDto
        }
    }

    @Get('salary/:id')
    async getSalaryEvaluationById(@Param('id', ParseIntPipe) id: number): Promise<SalaryEvaluationDTO> {
        return SalaryEvaluationDTOMapper.toDTO(await this.getSalaryEvlByIdUC.execute(id));
    }

    @Get(':id')
    async getEvaluationById(@Param('id', ParseIntPipe) id: number): Promise<EvaluationDTO> {
        return EvaluationDTOMapper.toDTO(await this.getEvaluationByIdUC.execute(id));
    }

    @Put('salary/:id')
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

    @Put(':id')
    async updateEvaluation(@Param('id', ParseIntPipe) id: number, @Body() evaluation: EvaluationDTO): Promise<EvaluationDTO> {
        const updatedEvaluation = await this.updateEvaluationUC.execute({ ...evaluation });
        return EvaluationDTOMapper.toDTO(updatedEvaluation)
    }

    @Delete('salary/:id')
    deleteSalaryEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteSalaryEvlUC.execute(id);
    }

    @Delete(':id')
    deleteEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteEvaluationUC.execute(id);
    }
}