# Política de moderación de Mbaapohara

Tarea 2.1 del plan · aprobada el 19/11/2026 · **provisional** hasta tener la pregunta 19 de la encuesta y la
primera medición (tarea 2.4). Es la fuente de la página «Cómo moderamos» (1.9), de la guía de etiquetado (2.2),
del módulo `moderation` (2.3) y de la sección de moderación del PFG.

## 1. Principio

Mbaapohara existe para que las personas cuenten **cómo trata una empresa a quienes trabajan en ella**. Por eso:

- **Siempre se publica la crítica a la empresa sobre hechos laborales**, aunque sea dura: «no pagan el IPS»,
  «las horas extra se pagan tarde», «no hay agua potable en el depósito». Moderar no es filtrar opiniones negativas.
- Se modera lo que **pone en riesgo a personas** (nombres, acusaciones, insultos), lo que **rompe el anonimato**
  (datos de contacto) y lo que **no es una reseña** (publicidad, textos fuera de tema).
- Una empresa no puede retirar una reseña por ser negativa (sección 8).

## 2. Qué se analiza

- Los dos textos de la reseña, «Lo bueno» y «A mejorar», **juntos** (R6). Las calificaciones y las respuestas a
  los criterios no se moderan.
- Al proveedor del modelo de lenguaje **solo se envía el texto**: nunca el correo, la cuenta, la empresa ni el
  local. La política de privacidad lo informa.
- Toda reseña nueva **y toda edición** pasa por la moderación antes de publicarse.

## 3. Reglas de publicación

La persona las acepta antes de enviar su reseña (casilla obligatoria). Son también el texto base de la página
«Cómo moderamos».

1. Contá **tu propia experiencia** en esa empresa y ese local.
2. Hablá de **hechos sobre la empresa**: pagos, horarios, contratos, trato, seguridad.
3. **No nombres a nadie**: ni nombres, ni apodos, ni descripciones que apunten a una sola persona.
4. **No incluyas datos de contacto**: teléfonos, correos, números de documento ni enlaces.
5. **Sin insultos**, discriminación ni amenazas.
6. **Sin publicidad** ni textos que no hablen de tu experiencia de trabajo.
7. Una reseña por persona y local. Podés editarla; cada cambio vuelve a pasar por la moderación.

## 4. Categorías

Una reseña puede tener varias categorías a la vez. «Persona identificable» es alguien señalado por nombre, apodo
o una descripción que, en ese local, apunta a una sola persona (por ejemplo, «la encargada del turno noche»).

| Código | Categoría | Incluye | No incluye (se publica) | Detección |
| --- | --- | --- | --- | --- |
| **DP** | Datos personales de contacto | Teléfonos, correos, números de cédula o RUC de personas, enlaces | Montos de salario, fechas, horarios | Reglas locales |
| **TER** | Persona identificable | «El gerente Juan Pérez», apodos, «la cajera de la caja 3» con un reproche | Cargos genéricos sin reproche personal: «los encargados avisan tarde los horarios» | Modelo |
| **ACU** | Acusación de delito contra una persona identificable | Robo, acoso, abuso, fraude o amenazas atribuidos a una persona | El mismo hecho sobre la empresa: «hay acoso y la empresa no hace nada» | Modelo |
| **INS** | Insulto, odio o discriminación | Insultos (también en jopara), desprecio por sexo, origen, religión, discapacidad u opinión | Lenguaje informal o enojo sin insulto: «un desastre cómo pagan» | Lista local + modelo |
| **SPAM** | Spam o publicidad | Ofertas, promociones, avisos de empleo, texto repetido o sin sentido | Recomendar o no trabajar ahí | Reglas + modelo |
| **TEMA** | Fuera de tema | Textos que no hablan de la experiencia de trabajo (por ejemplo, del servicio como cliente) | Contexto breve que acompaña la experiencia laboral | Modelo |

## 5. Cómo se decide

**Paso 1. Reglas locales** (siempre, sin costo):

- coincidencias de **DP** (correo, teléfono, cédula, enlace);
- palabras de la **lista de insultos** del español paraguayo y del jopara, que mantiene el administrador;
- **texto repetido** o sin sentido.

**Paso 2. Modelo de lenguaje** (si las reglas no rechazaron): devuelve, para cada categoría, una confianza entre 0
y 1. Usa una instrucción fija y versionada, con un tiempo máximo de respuesta de **10 segundos** y **un solo
reintento**.

**Paso 3. Decisión**, en este orden (gana la primera que se cumple):

| # | Condición | Resultado |
| --- | --- | --- |
| 1 | Regla DP | **Rechazada** con explicación (se puede corregir y reenviar) |
| 2 | ACU con confianza ≥ 0,5 | **En revisión humana** (nunca se rechaza ni se publica sola) |
| 3 | Cualquier otra categoría con confianza ≥ **0,85** | **Rechazada** con explicación |
| 4 | Cualquier categoría entre **0,5 y 0,85**, una palabra de la lista de insultos o texto repetido | **En revisión humana** |
| 5 | El modelo no responde, responde algo inválido o se alcanzó el **tope de gasto** | **En revisión humana** |
| 6 | Todas las categorías por debajo de 0,5 | **Publicada** |

Los umbrales **0,5 y 0,85** son provisionales y se recalibran con la medición de la tarea 2.4.

La lista de insultos **no rechaza sola**: muchas palabras del jopara cambian de sentido según el contexto. Por eso
deriva a revisión, salvo que el modelo también marque INS con 0,85 o más.

## 6. Revisión humana

- La hace el **administrador** (D5: un solo rol que también modera). Objetivo: resolver en **48 horas**, que es el
  plazo que se le anuncia a la persona.
- Quien modera ve el texto, las categorías con su confianza y las reglas que saltaron. **No ve quién escribió la
  reseña**: la cola de moderación no muestra el correo ni la cuenta.
- Puede **publicarla** o **rechazarla** eligiendo una categoría y un motivo, que la persona va a leer.
- En ACU, lo habitual es pedir que se quite lo que identifica a la persona y se cuente el hecho sobre la empresa.

## 7. Qué ve cada persona

| Estado | Quién la ve | Mensaje para quien escribió |
| --- | --- | --- |
| Publicada | Todos | «Tu reseña ya está publicada.» |
| En revisión | Solo quien escribió | «Tu reseña está en revisión. Te avisamos en 48 horas.» |
| Rechazada | Solo quien escribió, con el motivo | Según la categoría (abajo); puede editarla y reenviarla |

Motivos de rechazo, en voseo y diciendo qué corregir:

| Código | Mensaje |
| --- | --- |
| DP | «Tu reseña tiene datos de contacto (un teléfono, un correo, un documento o un enlace). Sacalos y volvé a enviarla.» |
| TER | «Tu reseña nombra o señala a una persona. Contá lo que pasó sin decir quién fue.» |
| ACU | «Tu reseña acusa de un delito a una persona. Podés contar el hecho sobre la empresa sin identificar a nadie.» |
| INS | «Tu reseña tiene insultos o expresiones discriminatorias. Contá lo que pasó con otras palabras.» |
| SPAM | «Tu reseña parece publicidad o un texto repetido. Contá tu experiencia de trabajo.» |
| TEMA | «Tu reseña no habla de tu experiencia de trabajo en la empresa. Contá cómo fue trabajar ahí.» |

**Edición (confirmado el 21/11, tarea 3.3):** si se edita una reseña ya publicada, la versión anterior sigue visible
hasta que la nueva se publique; si la nueva se rechaza, queda la anterior. Mientras una versión espera la revisión
humana, la reseña no se puede volver a editar.

## 8. Después de publicar

**Reportes.** Cualquier cuenta puede reportar una reseña publicada, eligiendo una categoría de la sección 4 u
«Otro» con un comentario. Una cuenta reporta una misma reseña una sola vez.
- La reseña **sigue visible** mientras el administrador decide, para que nadie pueda bajar reseñas negativas
  reportándolas muchas veces.
- El administrador la **mantiene** o la **retira** con una categoría y un motivo; si la retira, quien la escribió
  ve el motivo y puede editarla.

**Solicitudes de empresas.** Las empresas no tienen cuenta (D3): usan un formulario público para pedir que se
revise una reseña o para corregir los datos de la empresa y sus locales.
- La solicitud se evalúa con **esta misma política**: una reseña se retira solo si incumple las reglas de la
  sección 3, nunca por ser negativa.
- Cada respuesta queda registrada con su motivo.
- **Implementación (3.9b, 21/11):** la respuesta se manda por correo a mano y se registra en el sistema; al
  registrarla se borran el nombre y el correo de quien escribió (quedan el mensaje y la respuesta). El formulario
  admite 3 envíos por hora por IP. Los reportes se agrupan por reseña y no muestran quién reportó.

## 9. Registro de decisiones

Cada decisión, automática o humana, se guarda con: reseña, origen (reglas / modelo / persona), resultado,
categorías y confianzas, reglas que saltaron, proveedor, versión del modelo y de la instrucción, administrador (si
fue humana), motivo y fecha. Sirve para:

- **auditoría**: por qué se publicó o se rechazó cada reseña;
- **transparencia**: el motivo que ve la persona;
- **métricas**: la medición del OE5 y la tasa de revisión humana.

## 10. Proveedor y costos

- Modelo de lenguaje vía API detrás del puerto `ModerationPort` (D4). El proveedor concreto se elige en la
  tarea 2.3; cambiarlo no toca estas reglas.
- **Tope de gasto: USD 5 por mes**, que va al presupuesto del PFG. Al alcanzarlo, todo va a revisión humana hasta
  el mes siguiente y el administrador recibe un aviso.

## 11. Medición (OE5)

El conjunto de evaluación (tarea 2.2) se etiqueta con las seis categorías de la sección 4 más «Ninguna». Se mide
exactitud, precisión, exhaustividad y F1 por categoría, con la matriz de confusión.

**Valores mínimos aceptables, fijados antes de medir** (propuesta para confirmar con el tutor):

| Indicador | Mínimo | Por qué |
| --- | --- | --- |
| Exhaustividad en DP | ≥ 0,95 | Son reglas: un dato de contacto publicado rompe el anonimato |
| Exhaustividad en TER y ACU | ≥ 0,80 | Es el riesgo legal; se prefiere revisar de más que publicar de menos |
| F1 macro en las seis categorías | ≥ 0,70 | Calidad general del clasificador |
| Textos «Ninguna» rechazados por error | ≤ 10 % | La crítica legítima a la empresa no debe frenarse |
| Reseñas derivadas a revisión humana | ≤ 30 % | Que la moderación sea sostenible para una sola persona |

## 12. Pendientes

- **Pregunta 19 de la encuesta:** cuando haya datos, confirmar qué temen más quienes publicarían (sobre todo la
  19.2, datos personales y de terceros) y ajustar categorías o mensajes.
- **Tarea 2.4:** recalibrar los umbrales con la primera medición.
- Confirmar con el tutor los valores mínimos de la sección 11 y la propuesta de la sección 7.
