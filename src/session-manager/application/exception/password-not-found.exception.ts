export class PasswordNotFoundException extends Error {
    constructor(email: string) {
        super(`No se ha encontrado la contrasña del usuario con  email"${email}"`);
        this.name = 'PasswordNotFoundException';
    }
  }