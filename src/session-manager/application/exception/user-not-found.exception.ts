export class UserNotFoundException extends Error {
    constructor(email: string) {
        super(`No se ha encontrado el usuario con Email "${email}"`);
        this.name = 'UserNotFoundException';
    }
  }