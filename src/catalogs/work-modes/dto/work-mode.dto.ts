import { WorkMode } from '../work-mode.entity';

export class WorkModeDTO {
    id: number;
    nombre: string;

    static from(entity: WorkMode): WorkModeDTO {
        return { id: entity.id, nombre: entity.nombre };
    }
}

export class WorkModePageDTO {
    data: WorkModeDTO[];
    total: number;
    page: number;
    pageSize: number;
}
