import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountBenefitEvaluationsUseCase } from "src/evaluations/application/use-case/benefit-evaluation/count.use-case";
import { CreateBenefitEvaluationUseCase } from "src/evaluations/application/use-case/benefit-evaluation/create.use-case";
import { DeleteBenefitsEvaluationUseCase } from "src/evaluations/application/use-case/benefit-evaluation/delete.use-case";
import { GetAllBenefitEvaluationsUseCase } from "src/evaluations/application/use-case/benefit-evaluation/get-all.use-case";
import { GetBenefitEvaluationByIdUseCase } from "src/evaluations/application/use-case/benefit-evaluation/get-by-id.use-case";
import { UpdateBenefitEvaluatonUseCase } from "src/evaluations/application/use-case/benefit-evaluation/update.use-case";
import { GlobalExceptionFilter } from "src/evaluations/infrastructure/exception-filter/benefit-evaluation/benefit.exception-filter";
import { NewBenefitEvaluationDTO } from "../dto/new-benefit-evaluation.dto";
import { BenefitEvaluationDTO } from "../dto/benefit-evaluation.dto";
import { BenefitEvaluationDTOMapper } from "../mapper/benefit-evaluation-dto.mapper";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";
import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { Contract } from "src/evaluations/domain/model/contract.entity";
import { ContractMapper } from "src/evaluations/infrastructure/mapper/contract.mapper";

@UseFilters(GlobalExceptionFilter)
@Controller('evaluation/benefit')
export class BenefitEvaluationController {
    constructor(
        private readonly createBenefitEvlUC: CreateBenefitEvaluationUseCase,
        private readonly updateBenefitEvlUC: UpdateBenefitEvaluatonUseCase,
        private readonly deleteBenefitEvlUC: DeleteBenefitsEvaluationUseCase,
        private readonly getBenefitEvlByIdUC: GetBenefitEvaluationByIdUseCase,
        private readonly getAllBenefitEvlUC: GetAllBenefitEvaluationsUseCase,
        private readonly countBenefitEvlUC: CountBenefitEvaluationsUseCase
    ) { }

    @Post(':idEvaluacion')
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

    /*@Get()
    async getAllBenefitsEvaluations(): Promise<ResponseModel<BenefitEvaluationDTO>> {
        console.log("Entro en el get benefit evaluations")
        const benefitEvalDto = (await this.getAllBenefitEvlUC.execute()).map(benefitEval => BenefitEvaluationDTOMapper.toDTO(benefitEval));
        return {
            count: await this.countBenefitEvlUC.execute(),
            data: benefitEvalDto
        }
    }*/

    @Get(':idEvaluacion')
    async getBenefitEvaluationById(@Param('idEvaluacion', ParseIntPipe) idEvaluacion: number): Promise<BenefitEvaluationDTO> {
     return BenefitEvaluationDTOMapper.toDTO(await this.getBenefitEvlByIdUC.execute(idEvaluacion));
     }

    @Put(':id')
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

    @Delete(':id')
    deleteSalaryEvaluation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteBenefitEvlUC.execute(id);
    }
}