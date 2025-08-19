import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewEvaluation } from "src/evaluations/domain/model/new-evaluation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationTypeORMModel } from "../model/evaluation.typeorm.model";
import { Repository } from "typeorm";
import { EvaluationMapper } from "../../mapper/evaluation.mapper";
import { Evaluation } from "src/evaluations/domain/model/evauation.entity";

@Injectable()
export class EvaluationTypeORMRepository implements EvaluationRepository {
    constructor(
        @InjectRepository(EvaluationTypeORMModel)
        private readonly evaluationRepo: Repository<EvaluationTypeORMModel>,
    ) { }

    async create(newEvaluation: NewEvaluation): Promise<Evaluation> {
        const evaluationTypeOrm = await this.evaluationRepo.save(EvaluationMapper.toTypeORMModel(newEvaluation))
        return EvaluationMapper.toDomain(evaluationTypeOrm)
    }

    async getAll(): Promise<Evaluation[]> {
        return (await this.evaluationRepo.find()).map(evaluationTypeOrm => EvaluationMapper.toDomain(evaluationTypeOrm));
    }

    async getById(id: number): Promise<Evaluation | null> {
        const evaluationTypeOrm = await this.evaluationRepo.findOne({
            where: { id },
            relations: ['office', 'office.empresa', 'user', 'job', 'company'],
        });
        return evaluationTypeOrm ? EvaluationMapper.toDomain(evaluationTypeOrm) : null
    }

    async update(id: number, evaluation: Partial<Evaluation>): Promise<Evaluation> {
        const evaluationFound = await this.evaluationRepo.findOne({
            where: { id },
            relations: ['office', 'office.empresa', 'user', 'job', 'company'],
        });
        if (!evaluationFound) {throw new Error(`Evaluation with id ${id} not found`)}
        const updated = Object.assign(evaluationFound, evaluation);
        await this.evaluationRepo.save(updated);
        return (await this.getById(id))!;
    }

    async delete(id: number): Promise<void> {
        await this.evaluationRepo.delete(id)
    }

    count(): Promise<number> {
        return this.evaluationRepo.count()
    }

}