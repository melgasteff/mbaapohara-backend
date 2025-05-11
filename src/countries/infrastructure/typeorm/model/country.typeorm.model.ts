import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('paises') 
export class CountryTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descripcion: string
}