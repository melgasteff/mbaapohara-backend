import { User } from "src/users/entities/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Entity } from "typeorm";

@Entity({ name: 'resenhas_perfil' })
export class ProfileReview {
     @PrimaryGeneratedColumn()
        id:number
    
        @Column()
        costo : number
    
        @Column()
        atencion : number
    
        @Column()
        calidad: number

        @Column()
        comentario:string
    
        @ManyToOne(() => User, user => user.reviews)
        @JoinColumn({name: 'id_usuario'})
        user: User;
}
