import { BadRequestException, NotFoundException } from '@nestjs/common';

// Convierte el 404 de un catálogo en un 400: un id inexistente en el cuerpo es un error del pedido.
export async function ensureCatalogRef(check: () => Promise<unknown>, message: string): Promise<void> {
    try {
        await check();
    } catch (error) {
        if (error instanceof NotFoundException) throw new BadRequestException(message);
        throw error;
    }
}

// Escapa los comodines de LIKE para buscar el texto tal cual.
export function escapeLike(text: string): string {
    return text.replace(/[\\%_]/g, char => '\\' + char);
}
