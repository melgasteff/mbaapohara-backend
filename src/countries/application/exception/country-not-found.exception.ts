export class CountryNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado el pais con ID"${id}"`);
      this.name = 'countryNotFoundException';
    }
  }
  