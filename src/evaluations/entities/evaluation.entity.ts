import { Job } from "src/jobs/entities/job.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'evaluaciones'})
export class Evaluation {
    @PrimaryGeneratedColumn()
    id :number

    @Column()
    categorias : string

    @ManyToOne(() => Job, job => job.evaluations )
    @JoinColumn({name: 'id_cargo'})
    job : Job
    
    @ManyToOne(() => User, user => user.evaluations)
    @JoinColumn({name: 'id_usuario'})
    user : User;
}
