export class CityAlreadyExistsException extends Error {
    constructor(descripcion: string) {
      super(`Ya existe una ciudad con la descripción: "${descripcion}"`);
      this.name = 'CityAlreadyExistsException';
    }
  }
  