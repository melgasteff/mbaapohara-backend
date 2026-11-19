import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Copia de solo lectura de usuarios para evaluations (se reemplaza en la Fase 3). El dueño es src/users.
@Entity({ name: 'usuarios' })
export class UserTypeORMModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'email' })
    email: string
}
