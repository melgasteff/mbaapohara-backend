import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { EvaluationTypeORMModel } from "./evaluation.typeorm.model"

@Entity({name: 'sueldos'})
export class SalaryEvaluationTypeORMModel {
@PrimaryColumn({name: 'id_evaluacion'})
idEvaluacion: number

@Column()
base : string

@Column({name: 'experiencia_area'})
experienciaArea : string

@Column({name: 'experiencia_empresa'})
experienciaEmpresa : string

@Column({name: 'bono'})
bono : string

@Column()
comision : string

@Column()
propina : string

@Column()
moneda : string

@Column()
frecuencia : string

@Column()
modalidad : string

@OneToOne(() => EvaluationTypeORMModel)
@JoinColumn({name: 'id_evaluacion'})
evaluation : EvaluationTypeORMModel;


}
