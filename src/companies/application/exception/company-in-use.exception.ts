export class CompanyInUseException extends Error {
    constructor(id: number) {
      super(`La empresa con ID"${id}" esta en uso`);
      this.name = 'CompanyInUseException';
    }
  }
  