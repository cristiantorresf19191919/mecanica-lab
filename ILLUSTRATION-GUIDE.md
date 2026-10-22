# Ilustraciones del curso

Preferencia del proyecto: usar Anatomy para las nuevas ilustraciones técnicas y explicaciones visuales. Fuente: https://github.com/wheresryan22/anatomy (MIT). El kit utilizado se conserva en dist/anatomy con su licencia.

## Figuras y modelos

Cada figura es un corte o banco didáctico idealizado, no un plano de fabricación. Concepto antes de geometría:
- Física: banco elástico, F = kx. Base, cuatro patas, cuatro fijaciones, regla, dos apoyos, dos guías, cuatro fijaciones de guía, carro, cuatro patines, carga, cinco ranuras, resorte y escala.
- Automotriz: ciclo Otto de cuatro tiempos y mecanismo biela-manivela. Base y patas, soportes, cárter, bloque seccionado, diez aletas, culata, fijaciones, dos válvulas, bujía, pistón, dos segmentos, biela, manivela y apoyos.
- Neumática: cámara de avance y fuerza ideal. Base, patas, bancada, pared seccionada, dos tapas, guías, fijaciones, pistón, vástago, bloque regulador, ranuras de ventilación y regla.
- Fluidos: prensa con dos áreas, conservación de volumen. Base y patas, depósito seccionado común, dos paredes traseras, cuatro paredes laterales, líquido, dos pistones, vástagos, platos, fijaciones y diez marcas de carrera.
- Electricidad: fuente regulable, resistencia, corriente y potencia. Base y patas, fuente con once ventilaciones, pantalla, placa, veinte pads, cuatro terminales, pistas, resistencia y cuatro bandas.

Movimiento y lecturas comparten model.mjs. Controles nativos de rango, pausa y reinicio. La animación se detiene fuera de pantalla y no arranca con movimiento reducido. No introducir recursos que requieran Netlify ni servicios externos para estas figuras.

## Regla de pertinencia por lección

El usuario rechazó expresamente mostrar un circuito DC resistivo en una lección de motor trifásico. Cada lección debe identificar su concepto y cargar el experimento correspondiente. Se pueden compartir componentes gráficos, pero no sustituir el fenómeno por una ilustración genérica de su curso.

Las ondas requieren ejes, unidades, lecturas y fases sincronizadas. Los motores deben distinguir campo y rotor. Neumática debe distinguir presión, caudal, fuerza y posición. Mecatrónica debe mostrar sensores, decisiones y actuaciones con sus condiciones. Los instrumentos isométricos de Anatomy complementan las gráficas técnicas; no las reemplazan.

Las figuras nuevas tienen un modelo puro en concepts/models.mjs, controles y supuestos explícitos. La reproducción de AC y giro está ralentizada; los controles cambian condiciones del modelo. No presentar los diagramas de sección ni las trayectorias prescritas como CAD, cálculo electromagnético completo o dinámica de fluidos resuelta.

## Nuevos experimentos y controles

`concepts/advanced.mjs` representa seis modelos adicionales. El brazo es una vista isométrica de cinemática plana, no una simulación dinámica; el orden de las articulaciones y la proyección deben conservarse. Cavitación usa presión absoluta y vapor de agua aproximado (Antoine, 10–80 °C), sin cálculo de NPSH. La inversión de fases representa el campo, no la maniobra transitoria de un rotor.

Verifica zoom contenido dentro de la escena, comparación de las tres métricas, cambio de velocidad visual y retos con coma decimal. La velocidad de reproducción no cambia las unidades físicas.

Referencia de contraste para la presión de vapor del agua: [tablas de NIST](https://nvlpubs.nist.gov/nistpubs/jres/80A/jresv80An5-6p775_A1b.pdf), aproximadamente 2,339 kPa a 20 °C. El ajuste simplificado del laboratorio da 2,33 kPa.

## Taller 3D seleccionable

`machines/PLAN.md` documenta el mecanismo y las piezas antes de la geometría. `geometry.mjs` usa Three.js para cuerpos y cámara orbital; `atlas.mjs` usa el kit SVG de Anatomy para las fichas. No confundir sus comprobaciones de navegador y cinemática con una auditoría del runtime 3D beta de Anatomy, que aquí no se utiliza.

Conservar las restricciones del mecanismo: longitud de biela constante, fases de válvulas ligadas a 720°, radios hidráulicos proporcionales a raíz del área, mismo volumen desplazado y misma ralentización para campo y rotor. La selección se ofrece por raycasting y por botones de teclado. La vista separada pausa el mecanismo; no es una simulación física de desmontaje. Revisar juntos corte, despiece, móvil y altura del iframe al modificar escenas.

Neumática: `machines/pneumatic.mjs` construye el circuito. Identificación funcional 1=P, 2=A, 4=B, 3=R, 5=S. Avance conecta 1→2 y 4→5; retorno conecta 1→4 y 2→3. Ambos escapes terminan en silenciadores hacia la atmósfera, nunca en el depósito. Al separar piezas se ocultan mangueras y volúmenes de aire para no dibujar conexiones imposibles. Los colores indican función, no el color físico del aire; el detalle interno de la válvula es funcional, no un plano constructivo.

PLC: `machines/plc-geometry.mjs` añade sensores, módulos CPU/I/O, bornes, LEDs y cables al circuito neumático. Las entradas, salida, luces, rutas de aire y registro deben derivarse del mismo estado de `plc-model.mjs`; nunca invertir por un temporizador gráfico independiente. El tiempo de espera solo comienza tras confirmar el extremo. Al fallar S1, el timeout desenergiza la válvula monoestable y provoca retorno, no una parada inmóvil. El rearme solo está disponible en fallo y con I0.0. La pausa congela el tiempo didáctico y no representa una parada neumática segura. Conservar controles de scan y prueba de sensor, movimiento reducido, despiece pausado y ocultación de cables durante el despiece.

Ladder: conservar la separación explícita entre la imagen de entradas/etapa evaluada en redes 01–07 y la etapa resultante utilizada para escribir Q en la red 08. Los colores salen de `ladderRows`, que también ejecuta el modelo; no duplicar condiciones en la vista. Contacto verdadero no implica peldaño energizado si otro contacto anterior está abierto. Mantener la prioridad de sensor sobre timeout, la exclusividad de etapas y los controles accesibles de pausa/scan. El ladder es SVG técnico complementario al taller 3D y su ficha Anatomy.

Dos cilindros: cada fila usa su propio modelo de posición, válvula y sensores; no animar B como copia temporal de A. YA está energizada en A+, B+ y B−; YB solo en B+. Etiquetas: a0/a1 → I0.0/I0.1, b0/b1 → I0.2/I0.3. El ladder y el modelo usan `dualRows` como fuente única de transición. Las ramas OR deben iluminar el tramo común si cualquiera conduce, sin que una rama falsa pinte encima de una verdadera. Mantener el ejemplo de un cilindro accesible y verificar alturas móviles con ayuda e inspector abiertos.

Mandos del pupitre: los eventos se procesan mediante un scan de `stepDual`; no escribir posiciones desde los botones. RUN inicia falso. Paro, fallo y cambio real de modo retiran salidas; MA/MB se borran en paro y cambio de modo. Los contactos de modo y el permiso RUN deben preceder a las ramas de salida. Distinguir siempre Paro (retorno por muelle) de pausa visual. El automático requiere ambas señales de origen para aceptar Marcha; después de rearme no arrancar solo. Verificar independencia manual, transición entre modos, bloqueo de mandos en despiece y alturas móviles.

Temporizadores y contador: `dual-model.mjs` ejecuta TON antes de evaluar las transiciones y conserva su imagen en `scan.timers`. No iniciar ET durante la carrera: exige RUN, AUTO, etapa y sensor de extremo; IN=0 borra ET/Q. `timers.mjs` dibuja esa imagen y las barras ET/PT. C1 recibe un único pulso de la transición 05, después de a0 y T4.Q. Al alcanzar 5 se escribe DONE y se retira RUN antes de calcular salidas, evitando un pulso de A+ para un sexto ciclo. CV se conserva en paro/modo; solo el reset explícito de C1 o el reinicio general lo borra.

HMI: `hmi-geometry.mjs` añade pedestal, marco, pantalla CanvasTexture y cable al PLC. Su actualización usa el mismo `dualFrame`; no inventar un segundo temporizador o contador. La selección debe admitir materiales de pantalla sin componente emissive. `hmi.mjs` distingue posición simulada de señales digitales, alarmas activas/reconocidas/resueltas y fallo inyectado. Mantener una única validación de ajustes en `hmi-model.mjs`, CV retenido y bloqueo de cambio de PV hasta reinicio de C1. La simulación debe actualizarse si está visible la HMI o el taller. Revisar móvil con todas las explicaciones abiertas.


### Tendencias HMI sincronizadas
La HMI registra posiciones simuladas A/B, cuatro sensores I0.0–I0.3 y salidas Q0.0/Q0.1 después de cada scan de 20 ms. Las ocho trazas comparten eje de tiempo con PLC, ladder y circuito 3D; las señales digitales usan escalones, sin interpolación. El buffer circular conserva 3.001 muestras (60 s), con ventanas de 10, 30 y 60 s. Pausa y avance de un scan operan sobre la simulación común; limpiar trazas conserva PLC y contador, mientras el reinicio general comienza un historial nuevo. En móvil el gráfico permite desplazamiento horizontal dentro de su panel.
Validado: captura de cada scan, valores idénticos al modelo, buffer circular, reinicio temporal, pausa/scan/reanudación y limpieza sin alterar el contador. Navegador sin errores; iframe móvil completo incluso con explicaciones abiertas.


### Fallos de proceso: presión y atasco
La HMI permite pérdida de alimentación (4 → 0 bar) y atasco independiente A/B. El presostato I0.4 exige ≥3 bar y fija FAULT en el siguiente scan, incluso en manual. RUN y ambas Q caen. El atasco congela solo su posición; en automático las redes 06–09 detectan falta de llegada por timeout, sin atribuir una causa que el PLC no puede conocer. En manual no hay timeout de carrera. A 0 bar no se modela movimiento; las válvulas vuelven por muelle pero el cilindro solo retorna al restaurar aire y liberar el atasco. Modelo didáctico, sin dinámica de despresurización.
PS y FALLO se registran en las tendencias. El manómetro, indicador PS cableado a I0.4, luces de atasco y pantalla 3D usan el estado común. Restaurar el proceso no rearma ni arranca; se requieren ambos orígenes y todas las pruebas de proceso retiradas para rearme. Se conservaron las alarmas de sensores y las 64 lecciones. Pruebas: atasco A/B, timeout, corte en auto/manual, ausencia de duplicados, retorno tras reparación, rearme sin arranque, navegador y móvil.


### Retos de diagnóstico
El panel «Encuentra el fallo oculto» reinicia el banco y arranca un caso aleatorio: presión, atasco A/B o desconexión a1/b1. Se inyecta durante la carrera correspondiente, no al cargar la página. El PLC sigue usando presión y sensores reales del modelo. Al dispararse la alarma se pausa la simulación para conservar las evidencias. Las luces de atasco y controles de inyección se ocultan mientras el reto no está revelado; se mantienen presión, posición, entradas, salidas y alarmas observables. Las pistas son progresivas; respuestas incorrectas conservan el reto y las correctas revelan una explicación causal. Consultar solución queda distinguido de resolver. Salir o reiniciar borra reto, fallos, contador y trazas; durante el reto no se aceptan cambios de modo, receta ni inyecciones adicionales. Se preservan los controles de observación y pausa/scan.
Validación: cinco casos deterministas, evidencia física de atasco versus extremo alcanzado sin señal, evaluación de respuestas, navegador sin errores y móvil con todas las explicaciones abiertas (altura máxima de iframe 16.000 px, origen y fuente validados).


### Dificultad y progreso del diagnóstico
Inicial sortea presión/atasco A/a1 y permite 3 pistas. Intermedio incluye las cinco causas y 2 pistas. Avanzado conserva las cinco, varía el punto de inyección entre 20–70 % de carrera y no ofrece pistas. La selección es para el próximo reto; no modifica uno activo. Puntuación: 100 − 20 por error − 10 por pista, mínimo 0; consultar solución vale 0. Una respuesta vacía no cuenta. Salir, reiniciar o iniciar otro caso registra el reto pendiente como abandonado.
El historial guarda como máximo 100 resultados en localStorage, sin duplicar al redibujar o salir de un caso resuelto. Compara por nivel: resueltos, abandonos, mejor nota y medias de los últimos 5 versus los 5 anteriores disponibles; abandonos excluidos de medias. El almacenamiento inaccesible conserva datos durante la sesión y muestra un aviso. Probado: niveles, puntuación, persistencia, límites, navegador y móvil.


### Avanzado: averías combinadas
Avanzado ahora sortea cuatro parejas simultáneas: presión+a1, presión+b1, atasco A+a1 o atasco B+b1. Ambas causas se activan en el mismo punto de carrera. El diagnóstico exige evidencia de la avería observable; no acepta adivinar el sensor oculto por falta de aire/atasco. Una respuesta correcta parcial habilita «Reparar causa identificada y continuar prueba»: elimina solo esa causa, conserva el sensor averiado, retorna con aire y ejecuta un rearme de prueba en origen seguido de nueva Marcha. Esta intervención explícita del alumno es propia del simulador; no altera el rearme normal del banco libre.
Se conservan tiempo, trazas y alarmas para comparar las dos etapas. Tras la segunda alarma se identifica el sensor y se completa el reto. Avanzado permite tres pistas (−10 cada una); cada error cuesta 20, y las dos respuestas correctas no penalizan. El historial incorpora averías identificadas/total, compatible con registros previos de una sola avería. Consultar solución revela ambas causas y no concede puntos. Pruebas de las cuatro parejas en modelo y navegador, respuesta a causa oculta, reparación parcial, segunda alarma, puntuación y móvil.


### Retos intermitentes
Nuevo nivel Intermitentes, con tres casos: presión sinusoidal entre 2–5 bar (periodo 1,2 s), a1 o b1 con pérdidas de 140 ms alternadas. El sensor comienza a fallar solo al alcanzar el extremo; los pulsos aparecen con posición estable y reinician TON antes del timeout. Una señal baja durante el retorno posterior no es prueba de intermitencia.
La presión simulada alimenta presostato, manómetro 3D, HMI, alarmas y una nueva traza analógica con umbral de 3 bar. El primer cruce bajo retira RUN/Q y retiene FAULT; recuperar presión no reinicia el proceso. Se observan 3 s adicionales antes de pausar automáticamente, para registrar múltiples cruces. El movimiento sigue siendo prescrito: bajo el umbral se inmoviliza; no modela caudal ni fricción. Tres pistas, explicación, puntuación y persistencia por nivel. Salir reinicia también las fluctuaciones. Pruebas de pulsos con posición estable, varios cruces PS, retención de fallo, temporización de observación, nota, navegador y móvil.


### Cursor de historial de scans
Cada muestra conserva una copia independiente de entradas, salidas, RUN, etapa, temporizadores, contador y redes evaluadas. El cursor selecciona el scan más cercano (20 ms); permite pulsar la gráfica, usar el deslizador, avanzar/retroceder una muestra, saltar cambios digitales o ir al último flanco de FALLO retenido. Seleccionar pausa la simulación. La lectura de señales y el ladder usan esa misma copia, con banner HISTORIAL y mandos del ladder bloqueados. La HMI y el circuito 3D también usan el scan seleccionado: posiciones, sensores, válvulas, presión, alarmas y salidas. Todos los mandos de escritura quedan bloqueados durante la revisión.
Volver al actual no reanuda ni cambia PLC/contador; reanudar la simulación o ejecutar un scan abandona la inspección. Limpiar o reiniciar borra el cursor. El buffer mantiene el límite de 3.001 muestras y no se persiste entre recargas. Pruebas de copia independiente, selección temporal, límites, eventos, ladder y lectura exactos en un pulso intermitente, retorno al actual sin mutar el PLC y móvil.

### Reproducción histórica sincronizada
Reproducir historial recorre los scans guardados a 0,1×, 0,25×, 0,5× o 1×. Circuito 3D, pantalla HMI y ladder comparten la misma copia del scan, sin interpolar señales digitales. Pausar permite examinar cada cambio; al llegar al final se detiene. Volver al actual recupera el PLC pausado sin modificar su estado ni añadir muestras. Las alarmas, eventos y fallos físicos también se guardan en cada muestra.

### Comparación normal / fallo
`machines/comparison.html` muestra dos bancos Three.js con HMI y ladder completos, controlados por un único reloj. `comparison-model.mjs` genera experimentos nuevos con el modelo Dual existente: origen idéntico, 4 bar, carreras de 2 s, cuatro TON de 1 s y un ciclo. Selección de presión baja, atasco A o a1 intermitente; cursor de 20 ms, primera diferencia observable, alarma y velocidades 0,1×–1×. No reutiliza ni altera el historial personal: abre en otra pestaña desde tendencias. Los visores aceptan snapshots únicamente del padre del mismo origen, sin ejecutar el PLC durante replay. Las pruebas verifican igualdad antes de la divergencia, tiempo común, alarma/salidas, final de ciclo sano y pulsos intermitentes. En móvil los bancos se apilan; el reloj sigue siendo común.
