import { ActiveCriterion } from '../model/review';

/**
 * Datos de otros módulos que la reseña necesita validar (docs/arquitectura.md, regla 3): el adaptador llama a los
 * servicios de `companies` y `catalogs`, así el dominio no conoce TypeORM ni los módulos livianos.
 */
export abstract class ReviewReferences {
    /** `true` si el local existe y está aprobado, igual que su empresa. */
    abstract isOfficeOpen(officeId: number): Promise<boolean>;
    /** `true` si el cargo existe y está aprobado. */
    abstract isJobAvailable(jobId: number): Promise<boolean>;
    abstract contractTypeExists(id: number): Promise<boolean>;
    abstract workModeExists(id: number): Promise<boolean>;
    /** Criterios activos (con código), en su orden: los que toda reseña nueva o editada tiene que responder. */
    abstract activeCriteria(): Promise<ActiveCriterion[]>;
}
