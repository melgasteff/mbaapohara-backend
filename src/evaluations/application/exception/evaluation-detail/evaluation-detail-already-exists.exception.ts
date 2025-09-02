export class EvaluationDetailAlreadyExistsException extends Error {
    constructor() {
      super(`Ya existe un detalle de evaluacion con las mismas caracteristicas`);
      this.name = 'EvaluationDetailAlreadyExistsException';
    }
  }