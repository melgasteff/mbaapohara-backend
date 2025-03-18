
import { Country } from "src/countries/entities/country.entity";
import { Office } from "src/offices/entities/office.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ciudades' })
export class City {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descripcion: string

    @OneToMany(() => User, (usuario) => usuario.ciudad)
    ciudadanos: User[];

    @ManyToOne(() => Country, (pais) => pais.ciudades)
    @JoinColumn({name: 'id_pais'})
    pais: Country;

    @OneToMany(() => Office, office => office.ciudad)
    offices : Office[]
}
