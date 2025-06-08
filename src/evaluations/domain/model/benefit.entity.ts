import { Contract } from "./contract.entity";

export class Benefit {
    id: number;
    descripcion: string
    contrato: Contract[]

    constructor(
        id: number,
        descripcion: string,
        contrato: Contract[]
    ) {
        if (id == null) throw new Error('El id es requerido');
        if (descripcion == null) throw new Error('La descripcion es requerida');
        if(contrato == null) throw new Error('El tipo de contrato es requerido')
        this.id = id;
        this.descripcion = descripcion
        this.contrato =contrato
    }
    getId(): number {return this.id }
    getDescripcion(): string { return this.descripcion }
    getContrato(): Contract[] {return this.contrato}
}