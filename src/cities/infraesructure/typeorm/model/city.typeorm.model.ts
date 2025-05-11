
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ciudades' })
export class CityTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descripcion: string

    @Column({name: 'id_pais'})
    idpais:number;

}