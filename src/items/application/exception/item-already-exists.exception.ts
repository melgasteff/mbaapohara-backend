export class ItemAlreadyExistsException extends Error {
    constructor(descripcion: string) {
      super(`Ya existe un item con la descripción: ${descripcion}`);
      this.name = 'ItemAlreadyExistsException';
    }
  }
  