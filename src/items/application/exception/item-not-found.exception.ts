export class ItemNotFoundException extends Error {
    constructor(id: number) {
      super(`No se ha encontrado el item con ID"${id}"`);
      this.name = 'ItemNotFoundException';
    }
  }
  