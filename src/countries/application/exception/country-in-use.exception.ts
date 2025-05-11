export class CountryInUseException extends Error {
    constructor(id: number) {
      super(`El Pais con ID ${id} no puede ser eliminada porque está en uso.`);
      this.name = 'countryNotFoundException';
    }
  }