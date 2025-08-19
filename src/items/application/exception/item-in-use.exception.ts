export class ItemInUseException extends Error {
    constructor(id: number) {
      super(`EL item con ID ${id} no puede ser eliminado porque está en uso.`);
      this.name = 'ItemInUseException';
    }
  }