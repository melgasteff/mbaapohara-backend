export class EvaluationInUseException extends Error {
    constructor() {
      super(`No se puede eliminar la evaluacion porque ya esta en uso`);
      this.name = 'EvaluationInUseException';
    }
  }