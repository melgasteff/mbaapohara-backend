// Lista inicial de insultos (español paraguayo y jopara) para las reglas locales. Una coincidencia NO rechaza:
// manda a revisión humana, porque muchas palabras cambian de sentido según el contexto (política, sección 5).
// La política prevé que la mantenga el administrador; por ahora vive en código y se mueve a la base cuando exista
// la administración de la moderación (Fase 3).
export const INSULTS: readonly string[] = [
    // español
    'idiota', 'idiotas', 'imbécil', 'imbéciles', 'imbecil', 'estúpido', 'estúpida', 'estúpidos', 'tarado', 'tarada',
    'tarados', 'pelotudo', 'pelotuda', 'boludo', 'boluda', 'mierda', 'puta', 'putas', 'hijo de puta', 'sinvergüenza',
    'sinvergüenzas', 'parásitos', 'payasos', 'burros', 'atorrantas', 'borrachos', 'drogadictos', 'brutos',
    // guaraní y jopara
    'tavy', 'vyro', 'añamemby', 'añamembý', 'aña memby', 'tembo', 'mbore', 'nde rakore',
];
