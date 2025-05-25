import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewSalaryEvaluation } from "src/evaluations/domain/model/new-salary-evaluation.entity";
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

    async create(newSalaryEvl: SalaryEvaluation): Promise<SalaryEvaluation> {
        const queryRunner = this.datasource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try{
            const salaryTypeOrm = SalaryEvaluationMapper.evaluationtoTypeORMModel(newSalaryEvl);
        
            const evaluation = await queryRunner.manager.save(salaryTypeOrm)
            //console.log("EValuation registrado ", evaluation)

            const salaryEvalTypeOrm = SalaryEvaluationMapper.SalarytoTypeORMModel(newSalaryEvl)
            salaryEvalTypeOrm.idEvaluacion = evaluation.id; //probar despues si funciona sacandole
            salaryEvalTypeOrm.evaluation = evaluation;
            const salaryEval = await queryRunner.manager.save(salaryEvalTypeOrm)
            
            await queryRunner.commitTransaction();

            return SalaryEvaluationMapper.toDomain(salaryEval, evaluation)      
        }catch(e){
            await queryRunner.rollbackTransaction();
            console.error("Error al registrar SalarayEval TypeORM", e)
            throw new Error("Error al registrar SalarayEval TypeORM") //Se puede cambiar por un error especifico
        }finally{
            queryRunner.release()
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
        const savedOffice = await this.salaryEvalRepo.save(updatedSalaryEval);
        return SalaryEvaluationMapper.toDomain(savedOffice, salaryEvalFound.evaluation);
    }

    async delete(id: number): Promise<void> {
        await this.salaryEvalRepo.delete(id)
    }

    count(): Promise<number> {
        return this.salaryEvalRepo.count()
    }

}