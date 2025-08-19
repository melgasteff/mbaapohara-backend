import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'empresas' })
export class CompanyTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column({name: 'rubro'})
    rubro: string

}