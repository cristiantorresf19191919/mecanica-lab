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
