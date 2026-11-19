import { ContractType } from '../contract-type.entity';

export class ContractTypeDTO {
    id: number;
    nombre: string;

    static from(entity: ContractType): ContractTypeDTO {
        return { id: entity.id, nombre: entity.nombre };
    }
}

export class ContractTypePageDTO {
    data: ContractTypeDTO[];
    total: number;
    page: number;
    pageSize: number;
}
