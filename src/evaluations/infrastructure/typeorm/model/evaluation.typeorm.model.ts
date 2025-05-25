import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JobTypeORMModel } from "./job.typeorm.model";
import { UserTypeORMModel } from "./user.typeorm.model";
import { CompanyTypeORMModel } from "./company.typeorm.model";
import { OfficeTypeORMModel } from "./office.typeorm.model";
import { SalaryEvaluationTypeORMModel } from "./salaryevaluation.typeorm.model";

@Entity('evaluaciones')
export class EvaluationTypeORMModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobTypeORMModel)
  @JoinColumn({ name: 'id_cargo' })
  job: JobTypeORMModel;

  @ManyToOne(() => UserTypeORMModel)
  @JoinColumn({ name: 'id_usuario' })
  user: UserTypeORMModel;

  @ManyToOne(() => CompanyTypeORMModel)
  @JoinColumn({ name: 'id_empresa' })
  company: CompanyTypeORMModel;

  @ManyToOne(() => OfficeTypeORMModel)
  @JoinColumn({ name: 'id_sucursal' })
  office: OfficeTypeORMModel;

  @OneToOne(() => SalaryEvaluationTypeORMModel, salary => salary.evaluation)
  salaryEvaluation: SalaryEvaluationTypeORMModel;
}