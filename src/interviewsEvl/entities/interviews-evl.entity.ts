import { Evaluation } from "src/evaluations/entities/evaluation.entity";
import { InterviewQuestion } from "src/interview-questions/entities/interview-question.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity('entrevistas')
export class InterviewEvl {
    @PrimaryColumn()
    id_evaluacion : number

    @Column()
    calificacion: number

    @Column()
    dificultad: string

    @OneToOne(() => Evaluation, evaluation => evaluation.interviewEvl)
    @JoinColumn({ name: 'id_evaluacion' })
    evaluation = Evaluation

    @OneToMany(() => InterviewQuestion, question => question.interviewEvl)
    question : InterviewQuestion
}
