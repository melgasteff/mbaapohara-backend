
export class City {
  private id: number;
  private descripcion: string;
  private idpais: number


  constructor(id: number, descripcion: string, idpais: number) {
    if (id == null) throw new Error('El ID es requerido');
    if (descripcion == null) throw new Error('La descripción es requerida'); 
    if(idpais == null) throw new Error("El pais es requerido");
    this.id = id;
    this.descripcion = descripcion;
    this.idpais = idpais
    console.log('city creado con idpais:', this.idpais);
  }

  getDescripcion(): string {
    console.log("get description")
    return this.descripcion;
  }

  getId(): number {
    return this.id;
  }
  getPais(): number{
    console.log('get pais')
    return this.idpais
  }

}
