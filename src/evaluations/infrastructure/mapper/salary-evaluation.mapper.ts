import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationTypeORMModel } from "../typeorm/model/salaryevaluation.typeorm.model";
import { EvaluationTypeORMModel } from "../typeorm/model/evaluation.typeorm.model";
import { Job } from "src/evaluations/domain/model/job.entity";
import { User } from "src/evaluations/domain/model/user.entity";
import { Company } from "src/evaluations/domain/model/company.entity";
import { Office } from "src/evaluations/domain/model/office.entity";
import { NewSalaryEvaluation } from "src/evaluations/domain/model/new-salary-evaluation.entity";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";
import { JobTypeORMModel } from "../typeorm/model/job.typeorm.model";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";
import { OfficeTypeORMModel } from "../typeorm/model/office.typeorm.model";
import { OfficeMapper } from "./office.mapper";
import { UserMapper } from "./user.mapper";
import { CompanyMapper } from "./company.mapper";
import { JobMapper } from "./job.mapper";

export class SalaryEvaluationMapper {
    
    static toDomain(salaryEvlTypeOrm: SalaryEvaluationTypeORMModel, evaluationTypeOrm: EvaluationTypeORMModel): SalaryEvaluation {
         if (!evaluationTypeOrm || !evaluationTypeOrm.job || !evaluationTypeOrm.user || !evaluationTypeOrm.company || !evaluationTypeOrm.office) {
        console.error('Faltan relaciones en evaluation:', evaluationTypeOrm);
        throw new Error('Relaciones incompletas en la evaluación');
    }
        const job = new Job(evaluationTypeOrm.job.id, evaluationTypeOrm.job.descripcion)
        /*const user = new User(
            evaluationTypeOrm.user.id,
            evaluationTypeOrm.user.nombre,
            evaluationTypeOrm.user.apellido,
            evaluationTypeOrm.user.usuario,
            evaluationTypeOrm.user.email,
            evaluationTypeOrm.user.contrasenha,
            evaluationTypeOrm.user.idciudad,
            evaluationTypeOrm.user.tipoUsuario,
            evaluationTypeOrm.user.descripcion
        )*/
        const company = new Company(
            evaluationTypeOrm.company.id,
            evaluationTypeOrm.company.nombre,
            evaluationTypeOrm.company.rubro
        )
        /*const office = new Office(
            evaluationTypeOrm.office.id,
            evaluationTypeOrm.office.nombre,
            evaluationTypeOrm.office.email,
            evaluationTypeOrm.office.telefono,
            evaluationTypeOrm.office.cantEmpleados,
            evaluationTypeOrm.office.idCiudad,
            company
        )*/
        return new SalaryEvaluation(
            evaluationTypeOrm.id,
            job,
            //user,
            UserMapper.toDomain(evaluationTypeOrm.user),
            company,
            OfficeMapper.toDomain(evaluationTypeOrm.office),
            //office,
            salaryEvlTypeOrm.base,
            salaryEvlTypeOrm.experienciaArea,
            salaryEvlTypeOrm.experienciaEmpresa,
            salaryEvlTypeOrm.bono,
            salaryEvlTypeOrm.comision,
            salaryEvlTypeOrm.propina,
            salaryEvlTypeOrm.moneda,
            salaryEvlTypeOrm.frecuencia,
            salaryEvlTypeOrm.modalidad
        );
    }

    

    static SalarytoTypeORMModel(newSalaryEvl: NewSalaryEvaluation): SalaryEvaluationTypeORMModel {
        const evaluationTypeOrm = new EvaluationTypeORMModel();

        evaluationTypeOrm.company = CompanyMapper.toTypeORMModel(newSalaryEvl.company);

        evaluationTypeOrm.job = JobMapper.toTypeORMModel(newSalaryEvl.job);

        evaluationTypeOrm.user = UserMapper.toTypeORMModel(newSalaryEvl.user);
        
        evaluationTypeOrm.office = OfficeMapper.toTypeORMModel(newSalaryEvl.office);

        const salaryEvalTypeOrm = new SalaryEvaluationTypeORMModel();
        salaryEvalTypeOrm.evaluation = evaluationTypeOrm;
        salaryEvalTypeOrm.base = newSalaryEvl.base;
        salaryEvalTypeOrm.experienciaArea = newSalaryEvl.experienciaArea;
        salaryEvalTypeOrm.experienciaEmpresa = newSalaryEvl.experienciaEmpresa;
        salaryEvalTypeOrm.bono = newSalaryEvl.bono;
        salaryEvalTypeOrm.comision = newSalaryEvl.comision;
        salaryEvalTypeOrm.propina = newSalaryEvl.propina;
        salaryEvalTypeOrm.moneda = newSalaryEvl.moneda;
        salaryEvalTypeOrm.frecuencia = newSalaryEvl.frecuencia;
        salaryEvalTypeOrm.modalidad = newSalaryEvl.modalidad;

        return salaryEvalTypeOrm;
    }

    static evaluationtoTypeORMModel(newSalaryEvl: NewSalaryEvaluation): EvaluationTypeORMModel {
        const evaluationTypeOrm = new EvaluationTypeORMModel();
        
        evaluationTypeOrm.company = CompanyMapper.toTypeORMModel(newSalaryEvl.company);

        evaluationTypeOrm.job = JobMapper.toTypeORMModel(newSalaryEvl.job);

        evaluationTypeOrm.user = UserMapper.toTypeORMModel(newSalaryEvl.user);
        
        evaluationTypeOrm.office = OfficeMapper.toTypeORMModel(newSalaryEvl.office);

        return evaluationTypeOrm;
    }
}
