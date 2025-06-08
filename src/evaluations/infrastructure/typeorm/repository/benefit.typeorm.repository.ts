import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { NewBenefitEvaluation } from "src/evaluations/domain/model/new-benefit-evaluation.entity";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { DataSource, Repository } from "typeorm";
import { BenefitEvaluationTypeORMModel } from "../model/benefit-evaluation.model";
import { EvaluationTypeORMModel } from "../model/evaluation.typeorm.model";
import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitTypeORMModel } from "../model/benefit.model";
import { In } from 'typeorm';
import { ContractMapper } from "../../mapper/contract.mapper";
import { BenefitEvaluationMapper } from "../../mapper/benefit-evaluation.mapper";
import { error } from "console";

@Injectable()
export class BenefitEvaluationTypeORMRepository implements BenefitEvaluationRepository {
    constructor(
        @InjectRepository(BenefitEvaluationTypeORMModel)
        private readonly benefitEvalRepo: Repository<BenefitEvaluationTypeORMModel>,
        @InjectRepository(EvaluationTypeORMModel)
        private readonly evaluationRepo: Repository<EvaluationTypeORMModel>,
        @InjectRepository(BenefitTypeORMModel)
        private readonly benefitRepo: Repository<BenefitTypeORMModel>,
        private datasource: DataSource
    ) { }

    async create(idEvaluacion: number, newBenefitEval: NewBenefitEvaluation): Promise<BenefitEvaluation> {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.evaluationRepo.findOneByOrFail({ id: idEvaluacion });

            const benefits: BenefitEvaluationTypeORMModel[] = newBenefitEval.getBeneficios().map(benefit => {
                const benfitFound = new BenefitEvaluationTypeORMModel();
                benfitFound.idEvaluacion = idEvaluacion;
                benfitFound.idBeneficio = benefit.getId();
                return benfitFound;
            });
            
            await queryRunner.manager.save([BenefitEvaluationTypeORMModel, ...benefits]);
            await queryRunner.commitTransaction();
            return new BenefitEvaluation(idEvaluacion, newBenefitEval.getBeneficios());
        } catch (e) {
            await queryRunner.rollbackTransaction();
            console.error("Error al registrar BenefitEvaluation TypeORM", e);
            throw new Error("Error al registrar BenefitEvaluation TypeORM");
        } finally {
            await queryRunner.release();
        }
    }

    async getByIds(benefitIds: number[]): Promise<Benefit[]> {
        const benefitEntities = await this.benefitRepo.find({
            where: {id: In(benefitIds)},
            relations: ['contratos']
        });

        return benefitEntities.map(b => {
            const contracts = b.contratos.map(contractOrm => ContractMapper.toDomain(contractOrm));
            return new Benefit(
                b.id,
                b.descripcion,
                contracts
            );
        });
    }

    async getAll(): Promise<BenefitEvaluation[]> {
        const benefitEvaluations = await this.benefitEvalRepo.find({
            relations: {
                evaluacion: { user: true, company: true, job: true, office: true },
                beneficios: { contratos: true },
            },
        })
        return BenefitEvaluationMapper.toDomainList(benefitEvaluations);
    }

    async getById(idEvaluacion: number): Promise<BenefitEvaluation | null> {
        throw error("no se implemento")
    }

    async update(idEvaluacion: number, benefitEval: Partial<BenefitEvaluation>): Promise<BenefitEvaluation> {
        throw error("no se implemento ")
    }

    async delete(id: number): Promise<void> {
        await this.benefitEvalRepo.delete(id)
    }

    count(): Promise<number> {
        return this.benefitEvalRepo.count()
    }
}