export class ReasonAlreadyExistsException extends Error {
    constructor(descripcion: string) {
      super(`Ya existe un motivo con la descripción: "${descripcion}"`);
      this.name = 'ReasonAlreadyExistsException';
    }
  }