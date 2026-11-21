// Excepciones de negocio de las reseñas. ReviewExceptionFilter las traduce a códigos HTTP.

/** La reseña no existe, no está publicada o es de otra persona (no se distingue, para no confirmar que existe). */
export class ReviewNotFoundException extends Error {
    constructor(id: number) {
        super(`No existe la reseña ${id}`);
    }
}

/** Una reseña por persona y local (R7): la existente se edita. */
export class ReviewAlreadyExistsException extends Error {
    constructor() {
        super('Ya escribiste una reseña de este local. Podés editarla desde «Mis reseñas».');
    }
}

/** No se edita una versión que espera la revisión humana: la revisión aprobaría un texto que ya quedó viejo. */
export class ReviewInReviewException extends Error {
    constructor() {
        super('Tu reseña está en revisión. Vas a poder editarla cuando se decida.');
    }
}

/** El contenido no cumple la forma de la reseña o referencia datos que no existen. */
export class InvalidReviewException extends Error {
    constructor(readonly problems: string[]) {
        super(problems.join('. '));
    }
}

/** La versión no existe. */
export class VersionNotFoundException extends Error {
    constructor(id: number) {
        super(`No existe la versión ${id}`);
    }
}

/** La versión ya no está en revisión: otra decisión llegó antes. */
export class VersionAlreadyDecidedException extends Error {
    constructor(id: number) {
        super(`La versión ${id} ya no está en revisión`);
    }
}
