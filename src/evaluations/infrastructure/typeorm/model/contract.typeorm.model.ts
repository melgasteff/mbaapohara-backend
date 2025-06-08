import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo_contrato')
export class ContractTypeORMModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string
}