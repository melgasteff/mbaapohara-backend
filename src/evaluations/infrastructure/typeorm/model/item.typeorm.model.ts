import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'items' })
export class ItemTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descripcion: string

    @Column({name: 'id_categoria'})
    idcategory:number;

}