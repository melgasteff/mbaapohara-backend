import { User } from "src/users/entities/user.entity"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"


@Entity({name: 'posteos'})
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descripcion: string

    @Column() 
    activo: string

    @Column()
    calificacion: number

    @Column()
    telefono: string

    @Column()
    email: string

    @Column()
    rubro: string

    @Column()
    servicio: string

    @ManyToOne(() => User,(usuario) => usuario.posteos )
    @JoinColumn({name: 'id_usuario'})
    autor: User

    
}
