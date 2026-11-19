// Resultado de un listado paginado. Lo usan los casos de uso y los controladores.
export interface Page<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface PageRequest {
    page: number;
    pageSize: number;
}

// Cantidad de filas a saltear para una página (las páginas empiezan en 1).
export function pageOffset({ page, pageSize }: PageRequest): number {
    return (page - 1) * pageSize;
}

export function mapPage<T, U>(page: Page<T>, fn: (item: T) => U): Page<U> {
    return { ...page, data: page.data.map(fn) };
}
