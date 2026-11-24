/** Grupo de rubro: reúne las secciones CIIU Rev. 4 en seis grupos para el directorio (decisión del 23/11/2026). */
export enum SectorGroup {
    Comercio = 'comercio',
    Industria = 'industria',
    Servicios = 'servicios',
    Gastronomia = 'gastronomia',
    Transporte = 'transporte',
    AgroOtros = 'agro-otros',
}

/** Secciones CIIU de cada grupo. */
export const GROUP_SECTIONS: Record<SectorGroup, string[]> = {
    [SectorGroup.Comercio]: ['G'],
    [SectorGroup.Industria]: ['B', 'C', 'D', 'E', 'F'],
    [SectorGroup.Servicios]: ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'T', 'U'],
    [SectorGroup.Gastronomia]: ['I'],
    [SectorGroup.Transporte]: ['H'],
    [SectorGroup.AgroOtros]: ['A', 'S'],
};

/** Grupo de una sección CIIU. Sin código o con uno desconocido, «agro y otros». */
export function sectorGroup(ciiu: string | null | undefined): SectorGroup {
    const letter = ciiu?.trim().charAt(0).toUpperCase() ?? '';
    const found = Object.values(SectorGroup).find(group => GROUP_SECTIONS[group].includes(letter));
    return found ?? SectorGroup.AgroOtros;
}
