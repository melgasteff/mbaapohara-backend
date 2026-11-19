
export class NewCity {

  private  descripcion: string;
  private idpais: number;

  constructor(descripcion: string, idpais:number) {
    if(descripcion == null) throw new Error('La descripción es requerida');
    if(idpais == null) throw new Error ('El pais es requerido');
    this.descripcion = descripcion;
    this.idpais =idpais
  }

  getDescripcion(): string {
    return this.descripcion;
  }
  getPais():number{
    return this.idpais
  }

}