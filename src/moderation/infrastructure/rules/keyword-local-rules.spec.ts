import { KeywordLocalRules } from './keyword-local-rules';

const rules = new KeywordLocalRules();
const contact = (text: string) => rules.check(text).includes('datos_contacto');

describe('Reglas locales', () => {
    describe('datos de contacto (DP)', () => {
        it.each([
            'Escribime al 0981 456 789 y te cuento',
            'WhatsApp +595 981 222 333',
            'Llamá al 0972-333-210',
            'El fijo de mi casa es 021 555 444',
            'Mi número: 0984 – 321 – 654',
            'Mi celu: 098l 22O 330 (con letras para que no lo borren)',
            'mi número es cero nueve ocho uno, cuatro cinco seis, siete ocho nueve',
            'mi correo es lorena.benitez@ejemplo.com',
            'escribime: maria punto lopez arroba ejemplo punto com',
            'Mi cédula es 4.567.890 por si quieren comprobar',
            'mi RUC personal es 4567890-1',
            'buscame como @cajera_oviedo',
            'entren a www.ejemplo-reclamos.com.py',
            'lo subí acá: bit.ly/reglamento-ejemplo',
            'Telegram: t.me/ex_empleado_py',
            'https://chat.ejemplo.com/grupo',
        ])('detecta: %s', (text) => expect(contact(text)).toBe(true));

        it.each([
            'Cobro Gs. 2.680.373 por mes, que es el mínimo',
            'Entré el 15/03/2024 y desde el primer día tuve IPS',
            'Te descuentan hasta 300.000 por mes de faltantes',
            'Con las comisiones podés llegar a 4.500.000 en buenos meses',
            'En la caja 3 siempre hay más trabajo',
            'El horario es de 7:00 a 15:00',
            'Hay un número interno 1234 para reclamos',
            'La empresa no aporta al IPS de nadie',
        ])('no confunde con un dato de contacto: %s', (text) => expect(contact(text)).toBe(false));
    });

    describe('lista de insultos', () => {
        it('detecta insultos en español y en jopara', () => {
            expect(rules.check('Los jefes son unos tavy')).toContain('lista_insultos');
            expect(rules.check('Toda la gerencia es una manga de vyros')).not.toContain('lista_insultos'); // plural no listado: lo ve el modelo
            expect(rules.check('Esta empresa está llena de idiotas')).toContain('lista_insultos');
        });

        it('no marca jopara que no insulta ni palabras que contienen un insulto', () => {
            expect(rules.check('Che, ndaje que la patrona es buena gente, mbarete los compañeros')).toEqual([]);
            expect(rules.check('El tavyrón del depósito')).toEqual([]);
        });
    });

    describe('texto repetido', () => {
        it('detecta caracteres, palabras o frases repetidas', () => {
            expect(rules.check('aaaaaaaaaaaaaaaaaaaa')).toContain('texto_repetido');
            expect(rules.check('excelente excelente excelente excelente excelente')).toContain('texto_repetido');
            expect(rules.check('buena empresa buena empresa buena empresa buena empresa buena empresa buena empresa')).toContain('texto_repetido');
        });

        it('no marca una reseña normal', () => {
            expect(rules.check('Pagan en fecha y el ambiente es bueno, pero las horas extra se pagan tarde.')).toEqual([]);
        });
    });
});
