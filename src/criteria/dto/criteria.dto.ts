import { CriteriaCategory } from '../entities/category.entity';
import { Criterion } from '../entities/criterion.entity';

/** Ítem público: lo que el asistente muestra y responde. */
export class CriterionDTO {
    codigo: string;
    orden: number;
    texto: string;
}

/** Categoría pública con sus ítems activos (GET /criteria). Misma forma que `categorias` del JSON provisional. */
export class CriteriaCategoryDTO {
    codigo: string;
    nombre: string;
    orden: number;
    items: CriterionDTO[];

    static from(category: CriteriaCategory): CriteriaCategoryDTO {
        return {
            codigo: category.codigo,
            nombre: category.nombre,
            orden: category.orden,
            items: category.items.map(item => ({ codigo: item.codigo, orden: item.orden, texto: item.texto })),
        };
    }
}

/** Ítem para la administración, con su estado y cuántas respuestas tiene. */
export class AdminCriterionDTO {
    id: number;
    codigo: string;
    texto: string;
    orden: number;
    activo: boolean;
    idCategoria: number;
    /** Respuestas guardadas (de cualquier versión). Con respuestas, cambiar el sentido del texto las desvirtúa. */
    respuestas: number;

    static from(item: Criterion, respuestas = 0): AdminCriterionDTO {
        return {
            id: item.id, codigo: item.codigo, texto: item.texto, orden: item.orden, activo: item.activo,
            idCategoria: item.idCategoria, respuestas,
        };
    }
}

/** Categoría para la administración, con todos sus ítems, activos o no (GET /criteria/admin). */
export class AdminCriteriaCategoryDTO {
    id: number;
    codigo: string;
    nombre: string;
    orden: number;
    activo: boolean;
    items: AdminCriterionDTO[];

    static from(category: CriteriaCategory, answers: Map<number, number> = new Map()): AdminCriteriaCategoryDTO {
        return {
            id: category.id, codigo: category.codigo, nombre: category.nombre, orden: category.orden, activo: category.activo,
            items: (category.items ?? []).map(item => AdminCriterionDTO.from(item, answers.get(item.id) ?? 0)),
        };
    }
}
