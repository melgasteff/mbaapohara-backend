export class CountryAlreadyExistsException extends Error {
    constructor(descripcion: string) {
      super(`Ya existe un pais con la descripción: "${descripcion}"`);
      this.name = 'CountryAlreadyExistsException';
    }
  }