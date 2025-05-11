export class CityInUseException extends Error {
    constructor(id: number) {
      super(`La ciudad con ID ${id} no puede ser eliminada porque está en uso.`);
      this.name = 'cityNotFoundException';
    }
  }