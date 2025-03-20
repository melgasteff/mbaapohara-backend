import { Company } from "src/companies/entities/company.entity";
import { Job } from "src/jobs/entities/job.entity";
import { Office } from "src/offices/entities/office.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'evaluaciones'})
export class Evaluation {
    @PrimaryGeneratedColumn()
    id :number

    @ManyToOne(() => Job, (job) => job.evaluations )
    @JoinColumn({name: 'id_cargo'})
    job : Job
    
    @ManyToOne(() => User, (user) => user.evaluations)
    @JoinColumn({name: 'id_usuario'})
    user : User;

    @ManyToOne(() => Company, (company) => company.evaluations)
    @JoinColumn({name: 'id_empresa'})
    company : Company;

    @ManyToOne(() => Office, (office) => office.evaluations)
    @JoinColumn({name: 'id_sucursal'})
    office : Office
}
