export class EvaluationDetailNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado el detalle de evaluacion con ID ${id}`);
      this.name = 'EvaluationDetailNotFoundException';
    }
  }