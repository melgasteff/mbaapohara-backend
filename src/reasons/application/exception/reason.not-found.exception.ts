export class ReasonNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado el motivo con ID: ${id}`);
      this.name = 'ReasonNotFoundException';
      Object.setPrototypeOf(this, ReasonNotFoundException.prototype);
    }
  }