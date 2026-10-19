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
