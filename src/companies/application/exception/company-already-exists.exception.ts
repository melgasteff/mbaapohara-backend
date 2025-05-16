export class CompanyAlreadyExistsException extends Error {
    constructor(nombre: string) {
      super(`Ya existe una empresa con la descripción: "${nombre}"`);
      this.name = 'CompanyAlreadyExistsException';
    }
  }
  