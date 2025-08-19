import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuarios' })
export class UserTypeORMModel{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'nombre' })
    nombre: string

    @Column({ name: 'apellido' })
    apellido: string

    @Column({ name: 'usuario' })
    usuario: string

    @Column({ name: 'email' })
    email: string

    @Column({ name: 'contrasena' })
    contrasenha: string

    @Column({ name: 'id_ciudad' })
    idciudad: number

    @Column({ name: 'tipo_usuario' })
    tipoUsuario: string

    @Column({ name: 'descripcion' })
    descripcion: string

}