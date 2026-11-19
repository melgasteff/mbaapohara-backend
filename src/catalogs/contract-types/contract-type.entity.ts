import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Tipo de contrato (decisión R5).
@Entity({ name: 'tipo_contrato' })
export class ContractType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}
