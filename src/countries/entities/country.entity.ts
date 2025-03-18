
import { IsNotEmpty, IsString } from "class-validator";
import { City } from "src/cities/entities/city.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'paises'})
export class Country {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    descripcion: string

    @OneToMany(() => City, (ciudad) => ciudad.pais)
    ciudades: City[];
}
