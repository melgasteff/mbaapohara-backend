import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/count.use-case";
import { CreateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/create.use-case";
import { DeleteEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/delete.use-case";
import { GetAllEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/get-all.use-case";
import { GetEvaluationByIdUseCase } from "src/evaluations/application/use-case/evaluation/get-by-id.use-case";
import { UpdateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/update.use-case";
import { GlobalExceptionFilter } from "src/evaluations/infrastructure/exception-filter/evaluation/evaluation.exception-filter";
import { UpdateValuesMissingError } from "typeorm";
import { NewEvaluationDTO } from "../dto/new-evaluation.dto";
import { EvaluationDTO } from "../dto/evaluation.dto";
import { EvaluationMapper } from "src/evaluations/infrastructure/mapper/evaluation.mapper";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { ContractRepository } from "src/evaluations/domain/repository/contract.repository";
import { SalaryEvaluationDTOMapper } from "../mapper/salary-evaluation-dto.mapper";
import { EvaluationDTOMapper } from "../mapper/evaluation-dto.mapper";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";
import { BenefitEvaluationDTO } from "../dto/benefit-evaluation.dto";
import { GetAllBenefitEvaluationsUseCase } from "src/evaluations/application/use-case/benefit-evaluation/get-all.use-case";
import { BenefitEvaluationDTOMapper } from "../mapper/benefit-evaluation-dto.mapper";
import { CountBenefitEvaluationsUseCase } from "src/evaluations/application/use-case/benefit-evaluation/count.use-case";
import { CountSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/count.use-case";
import { CreateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/create.use-case";
import { DeleteSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/delete.use-case";
import { GetAllSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-all.use-case";
import { GetSalaryEvaluationByIdUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-by-id.use-case";
import { UpdateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/update.use-case";
import { SalaryEvaluationDTO } from "../dto/salary-evaluation.dto";
import { NewSalaryEvaluationDTO } from "../dto/new-salary-evaluation.dto";
import { CreateBenefitEvaluationUseCase } from "src/evaluations/application/use-case/benefit-evaluation/create.use-case";
import { DeleteBenefitsEvaluationUseCase } from "src/evaluations/application/use-case/benefit-evaluation/delete.use-case";
import { GetBenefitEvaluationByIdUseCase } from "src/evaluations/application/use-case/benefit-evaluation/get-by-id.use-case";
import { UpdateBenefitEvaluatonUseCase } from "src/evaluations/application/use-case/benefit-evaluation/update.use-case";
import { NewBenefitEvaluationDTO } from "../dto/new-benefit-evaluation.dto";
import { ContractMapper } from "src/evaluations/infrastructure/mapper/contract.mapper";
import { Benefit } from "src/evaluations/domain/model/benefit.entity";

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
        private readonly createBenefitEvlUC: CreateBenefitEvaluationUseCase,
        private readonly updateBenefitEvlUC: UpdateBenefitEvaluatonUseCase,
        private readonly deleteBenefitEvlUC: DeleteBenefitsEvaluationUseCase,
        private readonly getBenefitEvlByIdUC: GetBenefitEvaluationByIdUseCase,
        private readonly getAllBenefitEvlUC: GetAllBenefitEvaluationsUseCase,
        private readonly countBenefitEvlUC: CountBenefitEvaluationsUseCase
    ) { }

    @Post('benefit/:idEvaluacion')
    async createBenefitEvaluation(
        @Param('idEvaluacion', ParseIntPipe) idEvaluacion: number,
        @Body() dto: NewBenefitEvaluationDTO
    ): Promise<BenefitEvaluationDTO> {
        const benefitEvaluation = await this.createBenefitEvlUC.execute(
            idEvaluacion,
            dto.beneficios
        );
        return {
            idEvaluacion: benefitEvaluation.getIdEvaluacion(),
            beneficios: benefitEvaluation.getBeneficios().map(b => ({
                id: b.getId(),
                descripcion: b.getDescripcion(),
                contratos: b.getContrato().map(contract => ({
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

    @Get('benefit')
    async getAllBenefitsEvaluations(): Promise<ResponseModel<BenefitEvaluationDTO>> {
        console.log("Entro en el get benefit evaluations")
        const benefitEvalDto = (await this.getAllBenefitEvlUC.execute()).map(benefitEval => BenefitEvaluationDTOMapper.toDTO(benefitEval));
        return {
            count: await this.countBenefitEvlUC.execute(),
            data: benefitEvalDto
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
    
    @Get('benefit/:idEvaluacion')
    async getBenefitEvaluationById(@Param('idEvaluacion', ParseIntPipe) idEvaluacion: number): Promise<BenefitEvaluationDTO> {
        return BenefitEvaluationDTOMapper.toDTO(await this.getBenefitEvlByIdUC.execute(idEvaluacion));
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

    @Put('benefit/:id')
    async updateBenefitEvaluation(
        @Param('id', ParseIntPipe) id: number,
        @Body() benefitEvl: BenefitEvaluationDTO
    ): Promise<BenefitEvaluationDTO> {
        const beneficios: Benefit[] = benefitEvl.beneficios.map(dto => {
            const contracts = dto.contratos.map(contractOrm =>
                ContractMapper.toDomain(contractOrm)
            );
            return new Benefit(
                dto.id,
                dto.descripcion,
                contracts
            )
        });

        const updatedBenefitEvaluation = await this.updateBenefitEvlUC.execute(id, beneficios);

        return BenefitEvaluationDTOMapper.toDTO(updatedBenefitEvaluation);
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

    @Delete('benefit/:id')
    deleteBenefitEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteBenefitEvlUC.execute(id);
    }

    @Delete(':id')
    deleteEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteEvaluationUC.execute(id);
    }
}