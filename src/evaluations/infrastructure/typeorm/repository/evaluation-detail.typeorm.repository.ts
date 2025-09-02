import { Injectable } from "@nestjs/common";
import { EvaluationDetailTypeORMModel } from "../model/evaluation-detail.typeorm.model";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { NewEvaluationDetail } from "src/evaluations/domain/model/new-evaluation-detail.entity";
import { EvaluationDetailMapper } from "../../mapper/evaluation-detail.mapper";

@Injectable()
export class EvaluationDetailTypeORMRepository implements EvaluationDetailRepository {
    constructor(
        @InjectRepository(EvaluationDetailTypeORMModel)
        private readonly evaluationDetailRepo: Repository<EvaluationDetailTypeORMModel>,
    ) { }

    async create(newEvaluationDetail: NewEvaluationDetail): Promise<EvaluationDetail> {
        const evaluationDetailTypeOrm = await this.evaluationDetailRepo.save(EvaluationDetailMapper.toTypeORMModel(newEvaluationDetail))
        return EvaluationDetailMapper.toDomain(evaluationDetailTypeOrm)
    }

    async getAll(): Promise<EvaluationDetail[]> {
        return (await this.evaluationDetailRepo.find()).map(evaluationDetailTypeOrm => EvaluationDetailMapper.toDomain(evaluationDetailTypeOrm));
    }

    async getById(id: number): Promise<EvaluationDetail | null> {
        const evaluationDetailTypeOrm = await this.evaluationDetailRepo.findOne({
            where: { id },
            relations: ['evaluation', 'item'],
        });
        return evaluationDetailTypeOrm ? EvaluationDetailMapper.toDomain(evaluationDetailTypeOrm) : null
    }

    async update(id: number, evaluationDetail: Partial<EvaluationDetail>): Promise<EvaluationDetail> {
        const evaluationDetailFound = await this.evaluationDetailRepo.findOne({
            where: { id },
            relations: ['evaluation', 'item'],
        });
        if (!evaluationDetailFound) {throw new Error(`Evaluation Detail with id ${id} not found`)}
        const updated = Object.assign(evaluationDetailFound, evaluationDetail);
        await this.evaluationDetailRepo.save(updated);
        return (await this.getById(id))!;
    }

    async delete(id: number): Promise<void> {
        await this.evaluationDetailRepo.delete(id)
    }

    count(): Promise<number> {
        return this.evaluationDetailRepo.count()
    }

}