export class CityNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado la ciudad con ID"${id}"`);
      this.name = 'cityNotFoundException';
    }
  }
  