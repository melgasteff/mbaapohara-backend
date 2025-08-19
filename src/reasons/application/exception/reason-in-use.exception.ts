export class ReasonInUseException extends Error {
    constructor(id: number) {
      super(`La razón con ID ${id} no puede ser eliminada porque está en uso.`);
      this.name = 'ReasonNotFoundException';
    }
  }