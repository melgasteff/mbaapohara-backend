export class SalaryEvaluationNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado la evaluacion de salario con ID"${id}"`);
      this.name = 'SalaryEvaluationNotFoundException';
    }
  }