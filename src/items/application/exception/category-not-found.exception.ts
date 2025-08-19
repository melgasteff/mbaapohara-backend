export class CategoryNotFoundException extends Error {
    constructor() {
      super(`No se ha encontrado la categoria`);
      this.name = 'CategoryNotFoundException';
    }
  }