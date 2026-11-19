import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { Page, PageRequest, pageOffset } from 'src/shared/domain/page';

// Página de una consulta con su total, en una sola llamada a findAndCount.
export async function findPage<T extends ObjectLiteral>(
    repo: Repository<T>,
    request: PageRequest,
    options: FindManyOptions<T> = {},
): Promise<Page<T>> {
    const [data, total] = await repo.findAndCount({
        ...options,
        skip: pageOffset(request),
        take: request.pageSize,
    });
    return { data, total, page: request.page, pageSize: request.pageSize };
}
