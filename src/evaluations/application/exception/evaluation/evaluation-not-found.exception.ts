export class EvaluationNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado la evaluacion con ID ${id}`);
      this.name = 'EvaluationNotFoundException';
    }
  }