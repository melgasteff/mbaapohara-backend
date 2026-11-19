import { City } from '../city.entity';

export class CityDTO {
    id: number;
    /** Código del distrito en el INE (Censo 2022): departamento + distrito, por ejemplo «1101». */
    codigoIne: string;
    nombre: string;
    idDepartamento: number;

    static from(city: City): CityDTO {
        return { id: city.id, codigoIne: city.codigoIne, nombre: city.nombre, idDepartamento: city.idDepartamento };
    }
}

export class CityPageDTO {
    data: CityDTO[];
    total: number;
    page: number;
    pageSize: number;
}
