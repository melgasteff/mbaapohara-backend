import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JobTypeORMModel } from "./job.typeorm.model";
import { UserTypeORMModel } from "./user.typeorm.model";
import { CompanyTypeORMModel } from "./company.typeorm.model";
import { OfficeTypeORMModel } from "./office.typeorm.model";
import { SalaryEvaluationTypeORMModel } from "./salaryevaluation.typeorm.model";
import { ContractTypeORMModel } from "./contract.typeorm.model";
import { BenefitTypeORMModel } from "./benefit.model";

@Entity('evaluaciones')
export class EvaluationTypeORMModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'id_cargo'})
  idCargo: number

  @Column({name: 'id_usuario'})
  idUsuario: number

  @Column({name: 'id_empresa'})
  idEmpresa : number

  @Column({name: 'id_sucursal'})
  idSucursal :number 

  @Column({name: 'id_tipo_contrato',  nullable: true})
  idContrato: number

  @Column({name: 'desde'})
  desde :Date

  @Column({name: 'hasta'})
  hasta :Date

  @ManyToOne(() => JobTypeORMModel, {eager:true })
  @JoinColumn({ name: 'id_cargo' })
  job: JobTypeORMModel;

  @ManyToOne(() => UserTypeORMModel, {eager:true})
  @JoinColumn({ name: 'id_usuario' })
  user: UserTypeORMModel;

  @ManyToOne(() => CompanyTypeORMModel, {eager:true})
  @JoinColumn({ name: 'id_empresa' })
  company: CompanyTypeORMModel;

  @ManyToOne(() => OfficeTypeORMModel, {eager:true})
  @JoinColumn({ name: 'id_sucursal' })
  office: OfficeTypeORMModel;

  @ManyToOne(() => ContractTypeORMModel, {eager:true, nullable: true} )
  @JoinColumn({ name: 'id_tipo_contrato' } )
  contrato: ContractTypeORMModel;

  @OneToOne(() => SalaryEvaluationTypeORMModel, salary => salary.evaluation)
  salaryEvaluation: SalaryEvaluationTypeORMModel;

  @ManyToMany(() => BenefitTypeORMModel)
  @JoinTable({
    name: 'evaluacion_beneficios',
    joinColumn: {
      name: 'id_evaluacion',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'id_beneficio',
      referencedColumnName: 'id'
    }
  })
  benefits: BenefitTypeORMModel[]
}