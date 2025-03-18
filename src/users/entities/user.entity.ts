
import { City } from "src/cities/entities/city.entity";
import { Evaluation } from "src/evaluations/entities/evaluation.entity";
import { Post } from "src/posts/entities/post.entity";
import { ProfileReview } from "src/profile-reviews/entities/profile-review.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: 'usuarios' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:false})
    nombre: string

    @Column({nullable:false})
    apellido: string

    @Column({nullable:false, unique:true})
    usuario: string

    @Column({nullable:false})
    email: string

    @Column({nullable:false})
    contrasena: string

    @Column({nullable:false})
    tipo_usuario: string

    @Column()
    descripcion : string

    @ManyToOne(() => City, (ciudad)=> ciudad.ciudadanos)
    @JoinColumn({ name: 'id_ciudad'}) 
    ciudad: City;

    @OneToMany(()=> Post, (post) => post.autor)
    posteos: Post[]

    @OneToMany(() => ProfileReview, review => review.user)
    reviews : ProfileReview[]

    @ManyToOne(() => Evaluation, evaluation => evaluation.user)
    evaluations : Evaluation []

}
