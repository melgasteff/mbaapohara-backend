import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cargos' })
export class JobTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'descripcion'})
    descripcion: string

}