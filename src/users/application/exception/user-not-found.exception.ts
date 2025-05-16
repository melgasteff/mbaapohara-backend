export class UserNotFoundException extends Error {
    constructor(id: number) {
        super(`No se ha encontrado el usuario con ID"${id}"`);
        this.name = 'UserNotFoundException';
    }
  }