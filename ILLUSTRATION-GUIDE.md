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
