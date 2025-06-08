import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { EvaluationTypeORMModel } from "./evaluation.typeorm.model";
import { BenefitTypeORMModel } from "./benefit.model";

@Entity('evaluacion_beneficios')
export class BenefitEvaluationTypeORMModel {
  @PrimaryColumn({ name: 'id_beneficio' })
  idBeneficio: number;

  @PrimaryColumn({ name: 'id_evaluacion' })
  idEvaluacion: number;

  @ManyToOne(() => BenefitTypeORMModel, { eager: true })
  @JoinColumn({ name: 'id_beneficio' })
  beneficios: BenefitTypeORMModel[];

  @ManyToOne(() => EvaluationTypeORMModel)
  @JoinColumn({ name: 'id_evaluacion' })
  evaluacion: EvaluationTypeORMModel;
}