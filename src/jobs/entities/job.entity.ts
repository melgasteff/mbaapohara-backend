import { Evaluation } from "src/evaluations/entities/evaluation.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'cargos'})
export class Job {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descripcion: string

    @ManyToOne(() => Evaluation, evaluation => evaluation.job)
    evaluations : Evaluation[]
    
}
