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
