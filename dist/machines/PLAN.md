# Three mechanism figures

Three.js renders freely orbitable solid mechanisms; Anatomy supplies the isometric engineering plate and visual conventions. These are separate mechanism figures, not a plant or the beta Anatomy turning-group runtime. Models are didactic and explicitly limited.

Engine: four feet, bed, four fasteners, two bearing pedestals, two bearings, shaft, two crank webs, crank pin, flywheel and six spokes, connecting rod and its two eyes, wrist pin, piston crown/skirt, three piston rings, cutaway liner, eight cooling fins, head, four head studs/nuts, inlet/exhaust poppets, stems/guides/springs, spark plug. Slider-crank equation drives joints, ideal 720-degree timing drives poppets.

Hydraulics: bed and feet/bolts; two cylinder bottom flanges and cutaway sleeves; two pistons and seals, rods and top platens; four tie rods per cylinder and nuts; connecting pipe and flange rings; fluid volumes and moving markers; pressure gauge case, face and needle; weight plates. Area ratio drives actual radii; displaced volume is conserved. Prescribed slow stroke, quasi-static pressure.

Motor: feet/bed/bolts; rear half housing and fins; stator yoke and six pole shoes with multiple copper winding turns; rotor laminations, 12 cage bars and two end rings; shaft, front/rear bearings, end shields; fan and blades; terminal box and six terminal studs. Two-pole three-phase field rotates; cage rotor follows with prescribed slip, both slowed identically. Phase colors encode the three windings. Exploded view pauses physical motion and separates assemblies for inspection.

Interaction: ray-picked pieces + keyboard buttons; pause, scrub, speed, cutaway/full shell, exploded view, camera presets, fullscreen, optional parts tour. Reduced motion starts paused, no loop offscreen. Anatomy atlas uses core slab/cylinder geometry.

Pneumatic bench (separate figure): compressor receiver, two saddles, four bolts, pump crankcase, flywheel/spokes, cylinder with six fins, piston/rod, filter and delivery pipe; regulator and gauge; 5/2 valve base/cut cover, spool/stem and three lands, coil, return spring, five distinct couplings, two exhaust silencers; actuator two endcaps, cut sleeve, four tie rods/eight nuts, piston/two seals, rod, gland, clevis, two pedestals; five flow routes and animated markers. Pressure colors identify supply and exhaust, not actual air color. Switching swaps P1→A2/B4→S5 to P1→B4/A2→R3. Prescribed stroke has endpoint dwells; supply remains pressurized with zero ideal steady flow at a closed endpoint. Reverse action keeps piston position continuous. Compressor motion is illustrative; pressure is regulated, not a tank filling simulation.

PLC extension: two magnetic end-position sensors clipped to the cylinder, their LEDs and separate electrical cable runs; PLC panel with mounting feet/DIN rail, CPU, input/output modules, power supply, cooling slots, screw terminals, status LEDs and output wire to the existing solenoid. 20 ms scans read actual simulated position, update state and then Q0.0. Single-solenoid spring-return 5/2: Q=1 extends, Q=0 retracts. Fault demonstration disconnects the extended sensor, triggers travel timeout, drops Q and returns the actuator; it never freezes a pressurized cylinder artificially. Physical motion is a prescribed speed, not a compressible-flow solver. Reset requires home input. Inspection/explosion pauses simulated time and hides separated wiring.

## Coordinación de dos cilindros
Dos ramales con cilindro, pistón, válvula 5/2, escapes y sensores a0/a1, b0/b1; compresor y regulador comunes. PLC con cuatro entradas y dos salidas. Geometría compartida con el circuito anterior, desplazada en dos filas y con cableado a bornes identificados. El modelo ejecuta las redes que dibuja el ladder: A+ espera a1, B+ espera b1, B− espera b0, A− espera a0. A conserva presión de avance durante ambos movimientos de B. En fallo ambas válvulas retornan por muelle. La ficha Anatomy muestra los dos actuadores y el rack.

## Pupitre de mando
Pedestal con pulsador verde de marcha, rojo de paro, selector de modo y lámpara RUN. El ladder enseña la retención RUN, permiso de automático y selección de demandas manuales MA/MB. Los mandos HTML tienen equivalentes visuales en 3D. Las válvulas permanecen monoestables: cortar una salida inicia retorno, no retención de posición.

## Esperas y lote
Cuatro TON vinculados a los sensores de los extremos, manteniendo las mismas etapas y órdenes de válvula durante cada espera. El bloque CTU C1 cuenta la finalización de A− más T4, termina el lote al quinto pulso y deja ambos actuadores retraídos. El ladder muestra IN, PT, ET, Q, CU, CV y PV, con reinicio separado del arranque.

## Pantalla HMI
Pedestal lateral con pantalla frontal, marco y cable al PLC. La interfaz muestra posiciones simuladas A/B, cuatro entradas, salidas, modo, RUN, CV/PV y alarmas. Ajustes de T1–T4 y objetivo de lote, aplicados de forma conjunta y sin arrancar. Alarmas de timeout por sensor con reconocimiento separado del rearme y registro conservado.


### Tendencias HMI sincronizadas
La HMI registra posiciones simuladas A/B, cuatro sensores I0.0–I0.3 y salidas Q0.0/Q0.1 después de cada scan de 20 ms. Las ocho trazas comparten eje de tiempo con PLC, ladder y circuito 3D; las señales digitales usan escalones, sin interpolación. El buffer circular conserva 3.001 muestras (60 s), con ventanas de 10, 30 y 60 s. Pausa y avance de un scan operan sobre la simulación común; limpiar trazas conserva PLC y contador, mientras el reinicio general comienza un historial nuevo. En móvil el gráfico permite desplazamiento horizontal dentro de su panel.
Validado: captura de cada scan, valores idénticos al modelo, buffer circular, reinicio temporal, pausa/scan/reanudación y limpieza sin alterar el contador. Navegador sin errores; iframe móvil completo incluso con explicaciones abiertas.


### Fallos de proceso: presión y atasco
La HMI permite pérdida de alimentación (4 → 0 bar) y atasco independiente A/B. El presostato I0.4 exige ≥3 bar y fija FAULT en el siguiente scan, incluso en manual. RUN y ambas Q caen. El atasco congela solo su posición; en automático las redes 06–09 detectan falta de llegada por timeout, sin atribuir una causa que el PLC no puede conocer. En manual no hay timeout de carrera. A 0 bar no se modela movimiento; las válvulas vuelven por muelle pero el cilindro solo retorna al restaurar aire y liberar el atasco. Modelo didáctico, sin dinámica de despresurización.
PS y FALLO se registran en las tendencias. El manómetro, indicador PS cableado a I0.4, luces de atasco y pantalla 3D usan el estado común. Restaurar el proceso no rearma ni arranca; se requieren ambos orígenes y todas las pruebas de proceso retiradas para rearme. Se conservaron las alarmas de sensores y las 64 lecciones. Pruebas: atasco A/B, timeout, corte en auto/manual, ausencia de duplicados, retorno tras reparación, rearme sin arranque, navegador y móvil.
