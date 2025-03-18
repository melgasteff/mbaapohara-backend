import { Office } from "src/offices/entities/office.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'empresas'})
export class Company {
    @PrimaryGeneratedColumn()
    id :number

    @Column()
    nombre :string

    @Column()
    rubro :string

    @OneToMany(() => Office, office => office.empresa)
    offices : Office[]
}
