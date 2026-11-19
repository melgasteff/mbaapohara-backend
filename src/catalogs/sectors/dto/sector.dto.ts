import { Sector } from '../sector.entity';

export class SectorDTO {
    id: number;
    /** Letra de la sección CIIU Rev. 4, por ejemplo «G» para comercio. */
    codigoCiiu: string;
    /** Nombre corto para mostrar. */
    nombre: string;
    /** Nombre oficial de la sección CIIU Rev. 4. */
    descripcion: string;

    static from(entity: Sector): SectorDTO {
        return { id: entity.id, codigoCiiu: entity.codigoCiiu, nombre: entity.nombre, descripcion: entity.descripcion };
    }
}

export class SectorPageDTO {
    data: SectorDTO[];
    total: number;
    page: number;
    pageSize: number;
}
