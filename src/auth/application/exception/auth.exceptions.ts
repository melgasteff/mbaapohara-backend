// Excepciones de negocio de auth. El filtro de auth las traduce a HTTP.

// Email inexistente o contraseña incorrecta: el mismo error, para no revelar qué emails tienen cuenta.
export class InvalidCredentialsException extends Error {
    constructor() {
        super('Email o contraseña incorrectos');
    }
}

export class AccountBlockedException extends Error {
    constructor() {
        super('La cuenta está bloqueada');
    }
}

export class EmailAlreadyRegisteredException extends Error {
    constructor() {
        super('Ya existe una cuenta con ese email');
    }
}

export class ConsentRequiredException extends Error {
    constructor() {
        super('Hay que aceptar los términos y la política de privacidad para registrarse');
    }
}

export class AccountNotFoundException extends Error {
    constructor() {
        super('La cuenta no existe');
    }
}
