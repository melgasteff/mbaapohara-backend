export class CountryNotFoundException extends Error {
    constructor() {
      super(`No se ha encontrado el pais`);
      this.name = 'countryNotFoundException';
    }
  }