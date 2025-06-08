import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuarios' })
export class UserTypeORMModel{

    @PrimaryColumn({ name: 'email' })
    email: string

    @Column({ name: 'contrasena' })
    contrasenha: string

}