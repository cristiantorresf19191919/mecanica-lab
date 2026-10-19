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
