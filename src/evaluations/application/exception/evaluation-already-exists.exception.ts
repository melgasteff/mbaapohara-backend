export class EvaluationAlreadyExistsException extends Error {
    constructor() {
      super(`Ya existe una evaluacion con las mismas caracteristicas`);
      this.name = 'EvaluationAlreadyExistsException';
    }
  }