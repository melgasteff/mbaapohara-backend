export class BenefitEvaluationNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado la evaluacion de beneficio con ID"${id}"`);
      this.name = 'BenefitEvaluationNotFoundException';
    }
  }