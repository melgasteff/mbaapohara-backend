import { generate } from "rxjs";
import { City } from "src/cities/entities/city.entity";
import { Company } from "src/companies/entities/company.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'sucursales'})
export class Office {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    telefono :string

    @Column()
    cantidad_empleados :number

    @Column()
    email:string

    @Column()
    nombre: string

    @ManyToOne(() => Company, company => company.offices )
    @JoinColumn({name: 'id_empresa'})
    empresa :Company

    @ManyToOne(() => City, city => city.offices)
    @JoinColumn({name: 'id_ciudad'})
    ciudad :City

    
}
