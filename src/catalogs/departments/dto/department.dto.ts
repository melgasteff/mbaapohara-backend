import { Department } from '../department.entity';

export class DepartmentDTO {
    id: number;
    /** Código del departamento en el INE (Censo 2022), por ejemplo «11» para Central. */
    codigoIne: string;
    nombre: string;

    static from(department: Department): DepartmentDTO {
        return { id: department.id, codigoIne: department.codigoIne, nombre: department.nombre };
    }
}

export class DepartmentPageDTO {
    data: DepartmentDTO[];
    total: number;
    page: number;
    pageSize: number;
}
