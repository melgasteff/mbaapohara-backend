 export class Country{
    private id: number;
    private descripcion: string;

    constructor(id: number, descripcion: string){
        if(id== null) throw new Error('El ID es requerido');
        if(descripcion == null) throw new Error ('La descripcion es requerida');
        this.id = id
        this.descripcion= descripcion
    }

    getDescripcion():string{
        return this.descripcion
    }

    getId():number {
        return this.id
    }
 }