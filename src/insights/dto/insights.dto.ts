// Panel de indicadores (3.6, R9). Solo reseñas publicadas y criterios activos; nunca autor ni reseña individual.

/** Respuestas a un criterio o a una categoría. Se informa solo si la respondieron 3 reseñas o más, sin contar «No sé». */
export class IndicatorDTO {
    /** Reseñas que respondieron Sí, En parte o No. */
    resenas: number;
    si: number;
    enParte: number;
    no: number;
    /** «No sé o no aplica»: se informa, pero no entra en el porcentaje. */
    noSabe: number;
    /** «Sí» sobre Sí + En parte + No, entero. */
    porcentajeSi: number;
}

export class CriterionInsightDTO {
    codigo: string;
    texto: string;
    /** `null` con menos de 3 reseñas. */
    indicador: IndicatorDTO | null;
}

export class CategoryInsightDTO {
    codigo: string;
    nombre: string;
    /** Suma de sus criterios; `null` con menos de 3 reseñas. */
    indicador: IndicatorDTO | null;
    /** Todos los criterios activos, en el orden de administración. */
    criterios: CriterionInsightDTO[];
}

export class InsightsDTO {
    /** Reseñas publicadas con los filtros. */
    resenas: number;
    /** Empresas con al menos una de esas reseñas. */
    empresas: number;
    /** Calificación general promedio, con un decimal; `null` con menos de 3 reseñas. */
    promedio: number | null;
    /** Reseñas mínimas para mostrar un valor. */
    minimo: number;
    /** Todas las categorías activas con criterios activos, en el orden de administración. */
    categorias: CategoryInsightDTO[];
}
