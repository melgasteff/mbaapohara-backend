import { Classification, ClassifierFailure } from '../model/moderation';

export type ClassifierResult = { ok: true; classification: Classification } | { ok: false; failure: ClassifierFailure; costUsd: number };

/** Clasificador de texto sustituible (D4): hoy un modelo de lenguaje vía API; en la 2.5, otro para comparar. */
export abstract class TextClassifier {
    /** Recibe solo el texto de la reseña: nunca datos de la cuenta, la empresa ni el local. */
    abstract classify(text: string): Promise<ClassifierResult>;
}
