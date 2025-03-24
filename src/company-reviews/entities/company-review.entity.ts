import { Evaluation } from "src/evaluations/entities/evaluation.entity"
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm"

@Entity({ name: 'resenhas' })
export class CompanyReview {

    @PrimaryColumn()
    id_evaluacion: number
    
    @Column()
    calificacion: number

    @Column()
    activo: boolean

    @Column()
    titulo: string

    @Column()
    pros: string

    @Column()
    contras: string

    @Column()
    consejo: string

    @Column()
    modalidad: string

    @OneToOne(() => Evaluation, evaluation => evaluation.companyReview)
    @JoinColumn({ name: 'id_evaluacion' })
    evaluation: Evaluation;

}
