import { CriterionAnswer as A, ReviewInput, validateReview, WorkSituation } from './review';

const TEXT = 'Pagan en fecha y el ambiente es bueno, con contrato firmado desde el inicio.';
const criteria = [{ id: 10, code: 'CP01' }, { id: 11, code: 'CP02' }];
const input = (overrides: Partial<ReviewInput> = {}): ReviewInput => ({
    job: { id: 1 }, situation: WorkSituation.Former, lastYear: 2025, contractTypeId: 1, workModeId: 1, rating: 4,
    loBueno: TEXT, aMejorar: TEXT, answers: { CP01: A.Yes, CP02: A.DontKnow }, ...overrides,
});

describe('validateReview', () => {
    it('acepta una reseña completa y devuelve las respuestas por id de ítem, en el orden de los criterios', () => {
        const { content, problems } = validateReview(input({ answers: { CP02: A.No, CP01: A.Partly } }), criteria, 2026);
        expect(problems).toEqual([]);
        expect(content?.answers).toEqual([{ itemId: 10, answer: A.Partly }, { itemId: 11, answer: A.No }]);
    });

    it('recorta los textos y exige de 50 a 1.000 caracteres', () => {
        expect(validateReview(input({ loBueno: `  ${TEXT}  ` }), criteria, 2026).content?.loBueno).toBe(TEXT);
        expect(validateReview(input({ aMejorar: `   ${'a'.repeat(49)}   ` }), criteria, 2026).problems).toEqual([expect.stringContaining('A mejorar')]);
        expect(validateReview(input({ loBueno: 'a'.repeat(1001) }), criteria, 2026).problems).toEqual([expect.stringContaining('Lo bueno')]);
    });

    it('guarda el año solo si ya no trabaja ahí, y no acepta años futuros', () => {
        expect(validateReview(input({ situation: WorkSituation.Current, lastYear: 2026 }), criteria, 2026).content?.lastYear).toBeNull();
        expect(validateReview(input({ lastYear: null }), criteria, 2026).problems).toHaveLength(1);
        expect(validateReview(input({ lastYear: 2027 }), criteria, 2026).problems).toEqual([expect.stringContaining('2026')]);
    });

    it('exige responder todos los criterios activos y solo esos (R7)', () => {
        const { problems } = validateReview(input({ answers: { CP01: A.Yes, XX99: A.No } }), criteria, 2026);
        expect(problems).toEqual([expect.stringContaining('CP02'), expect.stringContaining('XX99')]);
    });

    it('normaliza los espacios del cargo propuesto y exige de 2 a 80 caracteres', () => {
        expect(validateReview(input({ job: { proposed: '  Repositor   de  góndola ' } }), criteria, 2026).content?.job).toEqual({ proposed: 'Repositor de góndola' });
        expect(validateReview(input({ job: { proposed: ' x ' } }), criteria, 2026).problems).toHaveLength(1);
    });

    it('calificación entera de 1 a 5', () => {
        expect(validateReview(input({ rating: 0 }), criteria, 2026).problems).toHaveLength(1);
        expect(validateReview(input({ rating: 4.5 }), criteria, 2026).problems).toHaveLength(1);
    });
});
