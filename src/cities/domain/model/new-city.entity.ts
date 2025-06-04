
export class NewCity {

  private  descripcion: string;
  private idpais: number;

  constructor(descripcion: string, idpais:number) {
    if(descripcion == null) throw new Error('La descripción es requerida');
    if(idpais == null) throw new Error ('El pais es requerido');
    this.descripcion = descripcion;
    this.idpais =idpais
    console.log('NewCity creado con idpais:', this.idpais);
  }

  getDescripcion(): string {
    console.log("get description")
    return this.descripcion;
  }
  getPais():number{
    console.log("get pais en new city entity")
    return this.idpais
  }

}