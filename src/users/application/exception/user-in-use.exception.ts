export class UserInUseException extends Error {
    constructor(id: number) {
      super(`El usuario con ID ${id} no puede ser eliminada porque está en uso.`);
      this.name = 'UserNotFoundException';
    }
  }