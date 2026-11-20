import { Injectable } from '@nestjs/common';
import { RuleSignal } from '../../domain/model/moderation';
import { LocalRules } from '../../domain/port/local-rules.port';
import { INSULTS } from './insult-list';

// Datos de contacto (DP). Los montos de dinero («Gs. 2.680.373»), las fechas y los números cortos NO cuentan.
const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
const EMAIL_IN_WORDS = /\barroba\b|\bpunto\s+com\b/i;
const HANDLE = /(^|[\s(])@[a-z0-9_.]{3,}/i;
const LINK = /\bhttps?:\/\/|\bwww\.|\bt\.me\/|\b[a-z0-9-]+\.(com|net|org|ly|py|io|me)(\.[a-z]{2})?\/[^\s]*/i;
/** Teléfonos de Paraguay: celulares (09xx), fijos (021…) y con prefijo +595, con o sin separadores. */
const PHONE = /(\+\s?595[\s.\-–]*\d{2,3}|\b0\d{2,3})[\s.\-–]*\d{3}[\s.\-–]*\d{3}\b/;
/** Cédula o RUC: la palabra cerca de un número de 5 dígitos o más. */
const ID_NUMBER = /\b(c[eé]dula|c\.?\s?i\.?|documento|ruc)\b[^0-9\n]{0,25}\d[\d.\s-]{4,}/i;
const DIGIT_WORDS = new Set(['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']);

/** Deshace la ofuscación más común en números: letras que imitan dígitos («098l 22O» → «0981 220»). */
function normalizeDigits(text: string): string {
    return text.replace(/\S*\d\S*/g, (word) => word.replace(/[lI|]/g, '1').replace(/[oO]/g, '0'));
}

/** Seis o más dígitos escritos con palabras seguidas («cero nueve ocho uno cuatro cinco…»). */
function hasSpelledNumber(text: string): boolean {
    let run = 0;
    for (const word of text.toLowerCase().split(/[^a-záéíóúñ]+/)) {
        run = DIGIT_WORDS.has(word) ? run + 1 : word ? 0 : run;
        if (run >= 6) return true;
    }
    return false;
}

function escape(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const INSULT = new RegExp(`(^|[^\\p{L}])(${INSULTS.map(escape).join('|')})(?=$|[^\\p{L}])`, 'iu');

/** Una palabra repetida 5 veces seguidas, un carácter repetido 10 veces o un texto con muy pocas palabras distintas. */
function isRepeated(text: string): boolean {
    if (/(.)\1{9,}/.test(text)) return true;
    const words = text.toLowerCase().split(/[^\p{L}\d]+/u).filter(Boolean);
    for (let i = 0, run = 1; i < words.length; i++) {
        run = i > 0 && words[i] === words[i - 1] ? run + 1 : 1;
        if (run >= 5) return true;
    }
    return words.length >= 12 && new Set(words).size / words.length < 0.3;
}

@Injectable()
export class KeywordLocalRules extends LocalRules {
    check(text: string): RuleSignal[] {
        const normalized = normalizeDigits(text);
        const signals: RuleSignal[] = [];
        if (
            EMAIL.test(text) || EMAIL_IN_WORDS.test(text) || HANDLE.test(text) || LINK.test(text) ||
            PHONE.test(normalized) || ID_NUMBER.test(normalized) || hasSpelledNumber(text)
        ) {
            signals.push('datos_contacto');
        }
        if (INSULT.test(text)) signals.push('lista_insultos');
        if (isRepeated(text)) signals.push('texto_repetido');
        return signals;
    }
}
