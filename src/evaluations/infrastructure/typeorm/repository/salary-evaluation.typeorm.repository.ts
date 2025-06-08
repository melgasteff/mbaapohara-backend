import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationTypeORMModel } from "../model/salaryevaluation.typeorm.model";
import { DataSource, Repository } from "typeorm";
import { SalaryEvaluationMapper } from "../../mapper/salary-evaluation.mapper";
import { EvaluationTypeORMModel } from "../model/evaluation.typeorm.model";
import { query } from "express";

@Injectable()
export class SalaryEvaluationTypeORMRepository implements SalaryEvaluationRepository {
    constructor(
        @InjectRepository(SalaryEvaluationTypeORMModel)
        private readonly salaryEvalRepo: Repository<SalaryEvaluationTypeORMModel>,
        @InjectRepository(EvaluationTypeORMModel)
        private readonly evaluationRepo: Repository<EvaluationTypeORMModel>,
        private datasource: DataSource
    ) { }

    async create(idEvaluacion: number, newSalaryEvl: SalaryEvaluation): Promise<SalaryEvaluation> {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Buscar la evaluación existente
            const evaluation = await this.evaluationRepo.findOneByOrFail({ id: idEvaluacion });

            const salaryEvalTypeOrm = SalaryEvaluationMapper.SalarytoTypeORMModel(newSalaryEvl);
            salaryEvalTypeOrm.idEvaluacion = idEvaluacion;
            salaryEvalTypeOrm.evaluation = evaluation;

            const salaryEval = await queryRunner.manager.save(salaryEvalTypeOrm);

            await queryRunner.commitTransaction();
            return SalaryEvaluationMapper.toDomain(salaryEval, evaluation);
        } catch (e) {
            await queryRunner.rollbackTransaction();
            console.error("Error al registrar SalaryEvaluation TypeORM", e);
            throw new Error("Error al registrar SalaryEvaluation TypeORM");
        } finally {
            await queryRunner.release();
        }
    }


    async getAll(): Promise<SalaryEvaluation[]> {
        const salaryEvaluations = await this.salaryEvalRepo.find({
            relations: {
                evaluation: { user: true, company: true, job: true, office: true, },
            },
        });
        return salaryEvaluations.map((salaryEval) => SalaryEvaluationMapper.toDomain(salaryEval, salaryEval.evaluation));
    }

    async getById(idEvaluacion: number): Promise<SalaryEvaluation | null> {
        const salayEvalTypeOrm = await this.salaryEvalRepo.findOne({
            where: { idEvaluacion },
            relations: { evaluation: { user: true, company: true, job: true, office: true, } }
        });
        return salayEvalTypeOrm ? SalaryEvaluationMapper.toDomain(salayEvalTypeOrm, salayEvalTypeOrm.evaluation) : null;
    }

    async update(idEvaluacion: number, salaryEvl: Partial<SalaryEvaluation>): Promise<SalaryEvaluation> {
        const salaryEvalFound = await this.salaryEvalRepo.findOne({
            where: { idEvaluacion },
            relations: { evaluation: { user: true, company: true, job: true, office: true, } }
        });
        const updatedSalaryEval = Object.assign(salaryEvalFound, salaryEvl);
        const savedSalary = await this.salaryEvalRepo.save(updatedSalaryEval);
        return SalaryEvaluationMapper.toDomain(savedSalary, salaryEvalFound.evaluation);
    }

    async delete(id: number): Promise<void> {
        await this.salaryEvalRepo.delete(id)
    }

    count(): Promise<number> {
        return this.salaryEvalRepo.count()
    }

}