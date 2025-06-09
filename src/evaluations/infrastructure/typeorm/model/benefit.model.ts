import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContractTypeORMModel } from "./contract.typeorm.model";
import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { EvaluationTypeORMModel } from "./evaluation.typeorm.model";

@Entity('beneficios')
export class BenefitTypeORMModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string;

  @ManyToMany(() => ContractTypeORMModel)
  @JoinTable({
    name: 'contrato_beneficio',
    joinColumn: { name: 'id_beneficio', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_tipo_contrato', referencedColumnName: 'id' }
  })
  contratos: ContractTypeORMModel[];

}