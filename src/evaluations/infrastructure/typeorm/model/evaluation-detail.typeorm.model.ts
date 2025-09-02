import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemTypeORMModel } from "./item.typeorm.model";
import { EvaluationTypeORMModel } from "./evaluation.typeorm.model";

@Entity('detalle_evaluacion')
export class EvaluationDetailTypeORMModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'id_evaluacion'})
  idEvaluation: number

  @Column({name: 'id_item'})
  idItem: number

  @Column({name: 'calificacion'})
  rating : number

  @Column({name: 'otro_motivo'})
  extra_reason :string 

  @ManyToOne(() => EvaluationTypeORMModel, {eager:true })
  @JoinColumn({ name: 'id_evaluacion' })
  evaluation: EvaluationTypeORMModel;

  @ManyToOne(() => ItemTypeORMModel, {eager:true})
  @JoinColumn({ name: 'id_item' })
  item: ItemTypeORMModel;

}