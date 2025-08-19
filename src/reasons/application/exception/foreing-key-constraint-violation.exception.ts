export class ForeignKeyConstraintViolationException extends Error {

    constructor() {
        super(`Registro en uso por otra entidad`);
        this.name = 'ForeignKeyConstraintViolationException';
        // Ajuste para la cadena de prototipos
        Object.setPrototypeOf(this, new.target.prototype)
    }
}