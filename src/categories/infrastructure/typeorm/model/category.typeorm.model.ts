import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'categorias'})
export class CategoryTypeORMModel {
    @PrimaryGeneratedColumn()
    id:number

    @Column({name: 'descripcion'})
    description: string
}