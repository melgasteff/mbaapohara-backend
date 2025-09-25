import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'motivos'})
export class ReasonTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'descripcion'})
    description: string

    @Column({name: 'calificacion'})
    rating: number

    @Column({name: 'eliminado'})
    deleted: boolean
}