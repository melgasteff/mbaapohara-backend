import { Evaluation } from "src/evaluations/entities/evaluation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'cargos'})
export class Job {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descripcion: string

    @OneToMany(() => Evaluation, evaluation => evaluation.job)
    evaluations : Evaluation[]
    
}
