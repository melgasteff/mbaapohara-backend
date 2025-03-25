import { InterviewEvl } from "src/interviewsEvl/entities/interviews-evl.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('preguntas')
export class InterviewQuestion {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    id_entrevista: number

    @Column()
    pregunta: string

    @Column()
    respuesta : string

    @ManyToOne(() => InterviewEvl, interview => interview.question)
    @JoinColumn({name : 'id_entrevista'})
    interviewEvl : InterviewEvl

}



