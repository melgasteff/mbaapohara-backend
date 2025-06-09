import { Contract } from "./contract.entity";

export class Benefit {
    private id: number;
    private descripcion: string
    private contratos: Contract[]

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
        this.contratos = contrato
    }
    getId(): number {return this.id }
    getDescripcion(): string { return this.descripcion }
    getContratos(): Contract[] {return this.contratos}
}