export class NewCountry{
    private descripcion: string;

    constructor(descripcion: string){
        if(descripcion == null) throw new Error ('La descripcion es requerida');
        this.descripcion= descripcion
    }

    getDescripcion():string{
        return this.descripcion
    }
 }