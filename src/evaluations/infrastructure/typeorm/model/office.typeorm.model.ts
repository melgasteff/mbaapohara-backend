import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CompanyTypeORMModel } from "./company.typeorm.model";

@Entity({ name: 'sucursales' })
export class OfficeTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column({})
    email:string;

    @Column()
    telefono: string;

    @Column({name: 'id_ciudad'})
    idCiudad: number

    @Column({name: 'cantidad_empleados'})
    cantEmpleados: number

   @ManyToOne(() => CompanyTypeORMModel, {eager:true})
    @JoinColumn({name: 'id_empresa'})
    empresa: CompanyTypeORMModel; 

}