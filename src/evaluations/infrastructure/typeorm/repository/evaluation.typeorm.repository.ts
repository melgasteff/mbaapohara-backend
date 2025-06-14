import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { NewEvaluation } from "src/evaluations/domain/model/new-evaluation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationTypeORMModel } from "../model/evaluation.typeorm.model";
import { Repository } from "typeorm";
import { EvaluationMapper } from "../../mapper/evaluation.mapper";
import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitsMapper } from "../../mapper/benefit.mapper";

@Injectable()
export class EvaluationTypeORMRepository implements EvaluationRepository {
    constructor(
        @InjectRepository(EvaluationTypeORMModel)
        private readonly evaluationRepo: Repository<EvaluationTypeORMModel>,
    ) { }

    async getBenefitEvaluations(evaluationId: number): Promise<Benefit[]> {
        const evaluationTypeOrm = await this.evaluationRepo.findOneOrFail({
            where: { id: evaluationId },
            relations: { benefits: true }
        });
        
        return BenefitsMapper.toDomainList(evaluationTypeOrm.benefits);
    }

    async updateBenefitEvaluation(evaluationId: number, benefits: Benefit[]): Promise<Evaluation> {
        const evaluacionTypeOrm = await this.evaluationRepo.findOneOrFail({
            where: { id: evaluationId },
            relations: { benefits: true, company: true, salaryEvaluation: true, user: true,  office: true, contrato: true, job: true }
        });

        evaluacionTypeOrm.benefits = BenefitsMapper.toTypeORMModelList(benefits)
        await this.evaluationRepo.save(evaluacionTypeOrm);
        return EvaluationMapper.toDomain(evaluacionTypeOrm);
    }

    updateSalaryEvaluation(evaluationId: number, salaryEvaluation: SalaryEvaluation): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async create(newEvaluation: NewEvaluation): Promise<Evaluation> { 
        const evaluationTypeOrm = await this.evaluationRepo.save(EvaluationMapper.toTypeORMModel(newEvaluation))
        return EvaluationMapper.toDomain(evaluationTypeOrm)
    }

    async getAll(): Promise<Evaluation[]> {
        return (await this.evaluationRepo.find()).map(evaluationTypeOrm => EvaluationMapper.toDomain(evaluationTypeOrm));
    }

    async getById(id: number): Promise<Evaluation | null> {
        const evaluationTypeOrm = await this.evaluationRepo.findOneBy({ id })
        return evaluationTypeOrm ? EvaluationMapper.toDomain(evaluationTypeOrm) : null
    }

    async update(id: number, evaluation: Partial<Evaluation>): Promise<Evaluation> {
        const evaluationFound = await this.evaluationRepo.findOneBy({ id })
        const updatedEvaluation = Object.assign(evaluationFound, evaluation)
        const savedEvaluation = await this.evaluationRepo.save(updatedEvaluation)
        return EvaluationMapper.toDomain(savedEvaluation)
    }

    async delete(id: number): Promise<void> {
        await this.evaluationRepo.delete(id)
    }

    count(): Promise<number> {
        return this.evaluationRepo.count()
    }

}