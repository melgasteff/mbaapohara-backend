import { ReasonTypeORMModel } from "src/reasons/infrastructure/typeorm/model/reason.typeorm.model";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { EvaluationDetailTypeORMModel } from "./evaluation-detail.typeorm.model";

@Entity('motivo_detalle')
export class ReasonDetailTypeORMModel {
    @PrimaryColumn({ name: 'id_detalle_evlauacion' })
    idEvaluation: number;

    @PrimaryColumn({ name: 'id_motivo' })
    idReason: number

    @ManyToOne(() => EvaluationDetailTypeORMModel, { eager: true })
    @JoinColumn({ name: 'id_detalle_evlauacion' })
    evaluationDetail: EvaluationDetailTypeORMModel;

    @ManyToOne(() => ReasonTypeORMModel, { eager: true })
    @JoinColumn({ name: 'id_motivo' })
    reason: ReasonTypeORMModel;

}