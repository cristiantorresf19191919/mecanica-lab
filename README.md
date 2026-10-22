# Mecánica · Laboratorio interactivo

Sitio educativo en español para aprender física desde cero con simulaciones 3D en Three.js.

## Curso desde cero

36 lecciones ordenadas en cinco módulos: fundamentos, principios eléctricos, electromecánica, neumática e hidráulica. Cada lección incluye objetivo, explicación, fórmula, ejemplo resuelto, ejercicio con retroalimentación y acceso a una animación 3D. El progreso se guarda localmente.

## Contenido

- Mecánica: fuerzas, movimiento, energía, péndulos y engranajes.
- Hidráulica: compresión, prensa hidráulica y caudal.
- Electricidad: corriente continua y alterna, alternador y sistema trifásico.
- Neumática: cilindro de doble efecto.
- Presión atmosférica: altitud, barómetro y presión absoluta/manométrica.

Las escenas incluyen controles de parámetros, cámara orbital, pausa, línea de tiempo, fórmulas y supuestos del modelo. Los modelos son educativos y simplificados.

## Ejecutar en local

No requiere compilación ni instalación de dependencias:

```sh
python3 -m http.server 8765 --directory dist
```

Abrir http://localhost:8765. Servir por HTTP permite cargar los módulos ES de Three.js. El navegador necesita WebGL2 para las escenas 3D. Las fuentes tipográficas se solicitan a Google Fonts, con fuentes de respaldo.

## Publicar en Netlify

La configuración `netlify.toml` publica `dist/` sin comando de compilación.

```sh
npx netlify-cli deploy --dir=dist --no-build --prod
```

## Estructura

- `dist/index.html`: página y contenido.
- `dist/app.js`: lecciones iniciales y cuestionario.
- `dist/module3d.js`: escenas y modelos 3D.
- `dist/module3d.css`: estilos del laboratorio.
- `dist/vendor/`: Three.js 0.180.0 y OrbitControls, distribuidos bajo licencia MIT; ver `THREE-LICENSE.txt`.

El progreso de las lecciones se guarda en el navegador mediante localStorage. El sitio no requiere cuentas ni un servidor de aplicación.

## Cursos ilustrados con Anatomy

La versión inicial incluía seis rutas: Física básica, Mecánica automotriz, Neumática, Mecánica de fluidos e hidráulica, Electricidad y electrónica, y Electromecánica como curso complementario. Cada lección conserva objetivo, explicación, ejemplo resuelto y ejercicio. El progreso anterior se migra a identificadores estables.

Las ilustraciones isométricas están construidas con [Anatomy](https://github.com/wheresryan22/anatomy), con licencia MIT en `dist/anatomy/LICENSE`. Incluyen control manual, pausa, reinicio y movimiento reducido. Son modelos didácticos idealizados, no planos de fabricación. Consulta ILLUSTRATION-GUIDE.md para continuar el estilo del proyecto.

Validación de contenidos y modelos: `node scripts/check-course.mjs`. No se necesita compilación.

## Laboratorios por concepto (64 lecciones)

La ruta ampliada contiene Física básica (10), Mecánica automotriz (6), Neumática (9), Fluidos e hidráulica (7), Electricidad y electrónica (12), Electromecánica (11) y Mecatrónica (9). Cada lección selecciona un concepto explícito; no existe una ilustración genérica por curso.

`dist/concepts/catalog.mjs` define controles, prácticas y límites. `models.mjs` concentra los cálculos. `lab.mjs` dibuja instrumentos y mecanismos, con pausa, recorrido temporal, movimiento reducido y suspensión fuera de pantalla. `curriculum.js` añade y ordena lecciones manteniendo claves de progreso estables; `notes.js` aporta explicaciones, razonamiento y errores frecuentes.

Ejemplos locales: `/?concept=threephase#curso`, `/?concept=motor#curso`, `/?concept=pi#curso`. Los laboratorios antiguos de Three.js siguen disponibles. Las vistas nuevas son diagramas e instrumentos interactivos, no modelos CAD ni simuladores de maquinaria certificados.

Comprobaciones: `node scripts/check-course.mjs`. Revisa límites de controles, unidades, coherencia entre gráfica y números, y navegación móvil al cambiar una lección.

Seis experimentos adicionales: resonancia forzada, ondas estacionarias, secuencia de fases, cavitación, lógica neumática AND/OR y cinemática de un brazo de dos articulaciones. `advanced.mjs` contiene sus representaciones. Todos los laboratorios permiten velocidad visual 0,25–2×, zoom y captura A/B; nueve incluyen retos numéricos con corrección.

## Taller de máquinas en 3D

Las lecciones de cuatro tiempos, Pascal, motor de inducción y variador abren `dist/machines/`. Hay tres escenas con piezas seleccionables, corte de la envolvente, despiece pausado, recorrido guiado, cámara orbital y presets, controles por teclado, pausa y recorrido temporal. El motor eléctrico conserva el desfase entre campo y rotor y muestra las tres corrientes sincronizadas.

Three.js renderiza los sólidos 3D; Anatomy aporta las fichas SVG isométricas y las convenciones de detalle técnico. No se utiliza el runtime beta de grupos giratorios de Anatomy. Los modelos ideales son `machines/model.mjs`; el despiece es una vista de inspección, no una simulación de desmontaje físico. El laboratorio previo de cada concepto sigue enlazado con sus ejercicios.

Validación adicional: `node scripts/check-machines.mjs` (cinemática y holgura del pistón, sincronización de válvulas, volumen y trabajo hidráulico, relación de áreas, deslizamiento y corrientes equilibradas). Recursos locales, sin servicios de pago.

El taller neumático (`?concept=valve#curso`, también integrado en `cylinder`) reúne compresor, depósito, regulador, válvula 5/2 y cilindro de doble efecto. Colores y marcadores distinguen alimentación/escape; la inversión conserva la posición, y el flujo ideal cesa en los extremos. Incluye acercamiento por pieza, despiece, corte y ficha SVG de Anatomy. La presión regulada y el diámetro determinan fuerzas ideales; el movimiento es prescrito y no simula compresibilidad ni llenado del depósito. `check-machines.mjs` verifica 9.000 estados de presión, áreas, rutas y conmutación.

El laboratorio `?concept=sequence#curso` conecta ese circuito con dos sensores magnéticos, un PLC con entradas I0.0/I0.1 y salida Q0.0, LEDs y cableado seleccionable. `plc-model.mjs` ejecuta scans didácticos de 20 ms: actualiza la posición, lee sensores, evalúa la secuencia y escribe la salida. La válvula monoestable avanza con Q=1 y retorna por muelle con Q=0. Incluye espera en extremos, registro de eventos, avance de un scan y desconexión de S1: el timeout desactiva Q, el cilindro retorna y el rearme requiere I0.0. La posición es prescrita; no controla equipos reales. Las pruebas cubren ciclos, transiciones por sensores, timeout y recuperación; se verificaron reproducción automática, consola y tamaño del iframe móvil.

El mismo taller incluye ladder en vivo junto al circuito: siete redes de transición y una red de salida con ramas OR para avance/espera final. `ladder-model.mjs` es el programa que ejecuta `stepPLC`, y `ladder.mjs` representa su imagen de scan. Los contactos muestran verdad lógica; los conductores muestran continuidad. La etapa se actualiza una sola vez por scan y la salida usa la etapa resultante. Incluye inspección de peldaños, avance de un scan y pausa al cambiar etapa. Es un secuenciador didáctico, no código listo para una marca comercial de PLC.

La lección de secuencias abre ahora el taller de dos cilindros (`machines/index.html?id=sequence-dual`), con un enlace al ejemplo anterior de un cilindro. La secuencia normal es A+ → B+ → B− → A−: A se mantiene extendido durante los dos movimientos de B. `dual-model.mjs` ejecuta las mismas redes que muestra `dual-ladder.mjs`; cuatro entradas y dos salidas comparten estado con sensores, LEDs, válvulas y pistones. El tiempo de carrera se ajusta por cilindro. La desconexión de b1 dispara un timeout, desenergiza ambas salidas y exige ambos orígenes para rearmar. `dual-geometry.mjs` reutiliza los actuadores con válvulas independientes y una alimentación común; la ficha isométrica Anatomy representa los dos cilindros.

El pupitre de los dos cilindros arranca con RUN=0. Marcha retiene RUN; Paro, cambio de modo o fallo lo borran. Automático exige a0 y b0 para arrancar; manual permite habilitar y ordenar A+/A−, B+/B− independientemente con memorias MA/MB. Cambiar de modo borra esas órdenes y exige nueva Marcha. Las salidas caen al parar, por lo que las válvulas monoestables retornan ambos cilindros; la pausa de simulación solo congela el tiempo. El ladder incluye la memoria RUN y las ramas de modo de ambas salidas, usando `dualOutputLogic`. La supervisión de tiempos por etapas es exclusiva del automático. El pupitre 3D refleja modo, pulsaciones y RUN; los botones operativos están junto al ladder.

Cuatro TON no retentivos esperan en los extremos confirmados: T1/a1, T2/b1, T3/b0 y T4/a0. PT inicia en 1 s y se ajusta de 0 a 5 s con RUN=0; ET empieza en cero al detectar el extremo y Q habilita la siguiente transición. C1 cuenta un pulso al completar A− y T4; con CV=PV=5 el lote termina en origen, RUN se desactiva y no comienza un sexto ciclo. Paro y cambio de modo conservan CV pero borran ET. Reiniciar C1 exige ambos orígenes, sin marcha ni fallo, y requiere nueva Marcha. El modo manual no temporiza ni cuenta ciclos automáticos; C1.Q solo inhibe el automático. El reinicio general de la simulación restablece también el lote y los PT por defecto.

La HMI de `machines/hmi.mjs` supervisa el mismo estado del PLC y escribe ajustes validados por `hmi-model.mjs`: PT de 0–5 s y PV entero de 1–50 ciclos (5 por defecto). No se admiten escrituras con RUN=1 o fallo, ni cambio de PV con CV distinto de cero. La pantalla física 3D replica posiciones, modo, RUN, contador y estado de alarma; el formulario HTML realiza la operación. Las posiciones en mm son telemetría del modelo, no lecturas analógicas de los sensores digitales.

Se pueden desconectar individualmente a0, a1, b0 o b1. En automático, la ausencia de confirmación genera una alarma con señal, código y tiempo de simulación; no se afirma que el PLC detecte directamente un cable roto. Reconocer mantiene el fallo. Rearmar requiere ambos orígenes y reconectar la señal simulada causante; conserva el registro y no arranca. El objetivo variable se refleja en CTU, parada por lote, textos y pantalla 3D.


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

### Diferencias y propagación
La comparación aplica contornos ámbar a piezas 3D asociadas a valores distintos, sensores individuales, lecturas HMI, contactos y bobinas del ladder. Los contactos se comparan por su resultado lógico y los TON por entrada, ET y Q; una red se marca también si cambia su permiso o ejecución. Los contornos se recalculan al reproducir, retroceder y cambiar de caso. No indican daño físico ni sustituyen el estado lógico. La guía ordena los hitos por el scan observado y permite saltar a cada etapa. En sensor intermitente, YB de la referencia se activa antes del timeout: la explicación distingue esa divergencia normal del bloqueo por fallo posterior.

### Predicción guiada
La comparación incluye un recorrido que se detiene un scan (20 ms) antes de cada transición de sensores, salidas, permiso RUN, P01 o T1–T4.Q en cualquiera de los bancos. Las preguntas se generan desde los snapshots reales: cuatro opciones y exactamente una correcta en el banco indicado. Al responder se muestra el scan y todos los cambios simultáneos. Pistas limitadas a dos, −10 cada una; errores −20; solución consultada 0; nota media de preguntas resueltas, sin doble contabilización. Durante el modo guiado se bloquean saltos/cambio de caso y se ocultan las explicaciones futuras. Se conserva el recorrido libre al salir. Resultados solo en memoria de la sesión; no se mezclan con el historial de diagnósticos. Pruebas: eventos reales, opciones únicas, penalizaciones, parada previa, sincronía, final y móvil.
