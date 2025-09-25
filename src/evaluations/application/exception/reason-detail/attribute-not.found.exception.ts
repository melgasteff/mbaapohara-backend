export class AttributeNotFoundException extends Error {
    constructor(attribute:string) {
      super(`No se ha encontrado el atributo ${attribute}`);
      this.name = 'AttributeNotFoundException';
    }
  }