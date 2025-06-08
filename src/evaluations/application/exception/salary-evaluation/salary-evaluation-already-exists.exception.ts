export class SalaryEvaluationAlreadyExistsException extends Error {
    constructor(idoffice: number, idjob: number, iduser: number, idcompany: number) {
      super(`Ya existe una evaluacion de salario del usuario con ID «${iduser}» a la sucursal con ID: «${idoffice}», con el cargo cn ID: "${idjob}" y a la empresa "${idcompany}"`);
      this.name = 'SalaryEvaluationAlreadyExistsException';
    }
  }
  