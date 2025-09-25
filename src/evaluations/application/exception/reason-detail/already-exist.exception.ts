export class ReasonDetailAlreadyExistsException extends Error {
    constructor() {
      super(`Ya existe un detalle de motivo con las mismas caracteristicas`);
      this.name = 'ReasonDetailAlreadyExistsException';
    }
  }