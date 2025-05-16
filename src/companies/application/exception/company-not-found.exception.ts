export class CompanyNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado la empresa con ID"${id}"`);
      this.name = 'CompanyNotFoundException';
    }
  }
  