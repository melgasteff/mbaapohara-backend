import { GROUP_SECTIONS, SectorGroup, sectorGroup } from './sector-groups';

describe('Grupos de rubro', () => {
    it('cubren las 21 secciones CIIU, cada una en un solo grupo', () => {
        expect(Object.values(GROUP_SECTIONS).flat().sort().join('')).toBe('ABCDEFGHIJKLMNOPQRSTU');
    });

    it('asignan el grupo por la sección', () => {
        expect(sectorGroup('G')).toBe(SectorGroup.Comercio);
        expect(sectorGroup('F')).toBe(SectorGroup.Industria);
        expect(sectorGroup('K')).toBe(SectorGroup.Servicios);
        expect(sectorGroup('i')).toBe(SectorGroup.Gastronomia);
        expect(sectorGroup('H')).toBe(SectorGroup.Transporte);
        expect(sectorGroup('S')).toBe(SectorGroup.AgroOtros);
    });

    it('sin código o con uno desconocido van a «agro y otros»', () => {
        expect(sectorGroup(null)).toBe(SectorGroup.AgroOtros);
        expect(sectorGroup('')).toBe(SectorGroup.AgroOtros);
        expect(sectorGroup('9')).toBe(SectorGroup.AgroOtros);
    });
});
