import { Evaluation } from "src/evaluations/entities/evaluation.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('sueldos')
export class SalaryEvl {

@PrimaryColumn()
id_evaluacion :number

@Column()
base : string

@Column()
experiencia_area : string

@Column()
experiencia_empresa : string

@Column()
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
modalidad : String


@OneToOne(() => Evaluation, evaluation => evaluation.salaryEvl)
@JoinColumn({name: 'id_evaluacion'})
evaluation : Evaluation
}
