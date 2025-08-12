export class NoReasonsFoundException extends Error {
    constructor() {
      super(`No hay registros de motivos`);
      this.name = 'NoReasonsFoundException';
    }
  }