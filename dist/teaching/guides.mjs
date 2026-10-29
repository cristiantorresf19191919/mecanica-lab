export const guides = {
  "physics": {
    "title": {
      "es": "Física: pasar de observar a explicar",
      "en": "Physics: move from observation to explanation"
    },
    "prerequisite": {
      "es": "Necesitas fracciones, despejar una incógnita y convertir cm a m. Antes de calcular, identifica el objeto y el intervalo de tiempo.",
      "en": "You need fractions, rearranging one equation and converting cm to m. Before calculating, identify the object and time interval."
    },
    "route": {
      "es": "Medición y unidades → posición y velocidad → fuerzas y aceleración → trabajo y energía → presión y oscilaciones. Avanza cuando puedas explicar la diferencia entre magnitud, cambio y rapidez de cambio.",
      "en": "Measurement and units → position and velocity → force and acceleration → work and energy → pressure and oscillations. Move on when you can distinguish a quantity, its change and its rate of change."
    },
    "reasoning": {
      "es": "Un diagrama de fuerzas representa interacciones sobre un objeto, no flechas de movimiento. Suma fuerzas por dirección antes de usar F neta = ma. Una velocidad constante requiere fuerza neta cero, aunque haya fuerzas individuales. Para trabajo, solo cuenta la componente de fuerza en la dirección del desplazamiento.",
      "en": "A force diagram represents interactions acting on one object, not arrows of motion. Add forces by direction before using net F = ma. Constant velocity requires zero net force, even when individual forces exist. Work uses only the force component along displacement."
    },
    "example": {
      "es": "Un carro de 10 kg recibe 30 N hacia delante y 10 N de rozamiento. La fuerza neta es 20 N y a = 20/10 = 2 m/s². Si parte del reposo, en 3 s llega a 6 m/s y recorre 9 m. El trabajo neto es 20 × 9 = 180 J; coincide con ½ × 10 × 6². Supuestos: fuerzas constantes, pista horizontal y masa constante.",
      "en": "A 10 kg cart experiences 30 N forward and 10 N friction. Net force is 20 N and a = 20/10 = 2 m/s². Starting from rest, after 3 s it reaches 6 m/s and travels 9 m. Net work is 20 × 9 = 180 J, matching ½ × 10 × 6². Assumptions: constant forces, level track and constant mass."
    },
    "diagnosis": {
      "es": "Si no coincide el resultado, comprueba primero unidades y signos. Después revisa si confundiste fuerza aplicada con fuerza neta. Dos cálculos que usan la misma hipótesis incorrecta no son evidencia independiente.",
      "en": "If results disagree, check units and signs first. Then check whether you used applied force instead of net force. Two calculations sharing the same incorrect assumption are not independent evidence."
    },
    "experiment": {
      "es": "En una lección de fuerzas, predice qué ocurre al duplicar masa manteniendo la fuerza neta. Registra valor inicial, valor final y cociente. En una lección de energía, busca si cambia altura, rapidez o energía disipada. No esperes que todas las animaciones permitan modificar masa.",
      "en": "In a force lesson, predict what happens when mass doubles at constant net force. Record initial value, final value and ratio. In an energy lesson, identify changes in height, speed or dissipation. Not every animation provides a mass control."
    },
    "question": {
      "es": "En el ejemplo, ¿qué cambia si el rozamiento aumenta a 30 N y el carro ya se mueve?",
      "en": "In the example, what changes if friction rises to 30 N while the cart is already moving?"
    },
    "answer": {
      "es": "La fuerza neta queda en cero y la aceleración es cero. El carro conserva su velocidad en este modelo; no se detiene inmediatamente. La fuerza aplicada compensa la energía disipada por rozamiento.",
      "en": "Net force and acceleration become zero. The cart keeps its velocity in this model; it does not stop instantly. The applied force replaces energy dissipated by friction."
    },
    "misconception": {
      "es": "Fuerza neta cero no significa ausencia de fuerzas ni ausencia de movimiento.",
      "en": "Zero net force does not mean no forces or no motion."
    },
    "boundary": {
      "es": "La animación ilustra el modelo. No mide incertidumbre experimental: en un experimento real anota resolución, repetibilidad y condiciones de medida.",
      "en": "The animation illustrates a model, not experimental uncertainty. In a real experiment record instrument resolution, repeatability and measurement conditions."
    }
  },
  "automotive": {
    "title": {
      "es": "Motor y diagnóstico: una causa necesita evidencia",
      "en": "Engine diagnosis: a cause needs evidence"
    },
    "prerequisite": {
      "es": "Repasa tensión, corriente, torque y el ciclo de 720°. Distingue motor de arranque de motor de combustión.",
      "en": "Review voltage, current, torque and the 720° cycle. Distinguish the starter motor from the combustion engine."
    },
    "route": {
      "es": "Cuatro tiempos → transmisión del esfuerzo → refrigeración y lubricación → arranque y carga → clasificación del síntoma → pruebas que discriminan causas → verificación.",
      "en": "Four strokes → torque transmission → cooling and lubrication → starting and charging → symptom classification → discriminating tests → verification."
    },
    "reasoning": {
      "es": "«No arranca» no es un diagnóstico. Sin giro, con giro lento y con giro normal son ramas distintas. Una caída de tensión se mide entre dos puntos del mismo trayecto mientras circula corriente. Una tensión en vacío puede parecer correcta aunque el suministro falle bajo carga. Si gira normal, comprueba condiciones de combustión y sincronización; no sigas atribuyéndolo todo a la batería.",
      "en": "“No start” is not a diagnosis. No crank, slow crank and normal cranking are different branches. Voltage drop is measured between two points on the same path while current flows. Open-circuit voltage can look normal even when supply fails under load. With normal cranking, investigate combustion conditions and timing rather than blaming every symptom on the battery."
    },
    "example": {
      "es": "Ejemplo didáctico: durante el arranque hay 11,0 V entre bornes de batería, 0,6 V de caída en el trayecto positivo y 0,8 V en el retorno. Al arrancador llegan 11,0 − 0,6 − 0,8 = 9,6 V. Medir solo la batería oculta 1,4 V perdidos en los trayectos. Estos valores sirven para el cálculo; no son límites universales de aprobación.",
      "en": "Teaching example: during cranking the battery terminals measure 11.0 V, the positive path drops 0.6 V and the return path drops 0.8 V. The starter receives 11.0 − 0.6 − 0.8 = 9.6 V. Measuring the battery alone hides 1.4 V lost in the paths. These values illustrate arithmetic; they are not universal pass limits."
    },
    "diagnosis": {
      "es": "Compara batería bajo carga y caídas de cada trayecto. Una caída localizada apoya resistencia en ese trayecto; no identifica por sí sola un tornillo concreto. Tras corregir, repite bajo condiciones comparables. No cambies batería y conexiones a la vez si necesitas saber qué resolvió el problema.",
      "en": "Compare loaded battery voltage and both path drops. A localized drop supports resistance in that path; it does not identify a specific bolt by itself. Retest under comparable conditions after correction. Do not change the battery and connections together if you need to establish which correction solved the fault."
    },
    "experiment": {
      "es": "En el banco de no arranca, compara caso sano y averiado al mismo instante. Escribe síntoma, dos causas posibles, medición discriminante, resultado esperado y resultado observado. Después de reparar, verifica arranque y permanencia en marcha cuando el modelo lo permita.",
      "en": "In the no-start bench, compare healthy and faulty cases at the same instant. Record the symptom, two possible causes, a discriminating measurement, its expected value and the observation. After repair, check starting and sustained running where the model supports it."
    },
    "question": {
      "es": "Si la caída del retorno baja de 0,8 a 0,1 V y los otros valores no cambian, ¿qué tensión llega al arrancador?",
      "en": "If return-path drop falls from 0.8 to 0.1 V while the other values stay fixed, what voltage reaches the starter?"
    },
    "answer": {
      "es": "11,0 − 0,6 − 0,1 = 10,3 V: una recuperación de 0,7 V. Aún debes comprobar si el giro y el arranque se normalizaron; una mejora eléctrica parcial no garantiza combustión.",
      "en": "11.0 − 0.6 − 0.1 = 10.3 V: a recovery of 0.7 V. Still check whether cranking and starting recover; a partial electrical improvement does not guarantee combustion."
    },
    "misconception": {
      "es": "Una chispa visible o una batería con tensión en reposo no demuestran que todas las condiciones de arranque se cumplan.",
      "en": "A visible spark or resting battery voltage does not establish every condition required for starting."
    },
    "boundary": {
      "es": "Los umbrales, tiempos de accionamiento y procedimientos reales dependen del vehículo. Usa datos del fabricante; la simulación no representa sistemas de alta tensión ni certifica una reparación.",
      "en": "Real thresholds, cranking durations and procedures depend on the vehicle. Use manufacturer data; this simulation does not represent high-voltage systems or certify a repair."
    }
  },
  "electricity": {
    "title": {
      "es": "Electricidad y electrónica: seguir energía y señal",
      "en": "Electricity and electronics: follow energy and signal"
    },
    "prerequisite": {
      "es": "Domina proporciones y diferencia entre voltios, amperios, ohmios y vatios. Identifica dos puntos de referencia antes de hablar de tensión.",
      "en": "Know ratios and the difference between volts, amperes, ohms and watts. Identify two reference points before discussing voltage."
    },
    "route": {
      "es": "Circuito cerrado → Ohm y Kirchhoff → serie/paralelo → senoide y RMS → trifásica → transformación y rectificación → condensadores → amplificación y saturación.",
      "en": "Closed circuits → Ohm and Kirchhoff → series/parallel → sine waves and RMS → three-phase systems → transformers and rectification → capacitors → amplification and saturation."
    },
    "reasoning": {
      "es": "La tensión es una diferencia de potencial; la corriente es carga por tiempo. En serie se conserva la corriente; en paralelo se comparte tensión. RMS describe el efecto térmico equivalente para una resistencia. Vp/√2 solo corresponde a una senoide sin componente continua. Tres fases equilibradas están separadas 120° eléctricos, no 120 segundos.",
      "en": "Voltage is a potential difference; current is charge per time. Series elements carry the same current; parallel branches share voltage. RMS describes equivalent heating in a resistor. Vp/√2 applies only to a sine wave without a DC component. Balanced phases are separated by 120 electrical degrees, not 120 seconds."
    },
    "example": {
      "es": "Un operacional ideal no inversor tiene Rg = 10 kΩ y Rf = 30 kΩ: G = 1 + 30/10 = 4. Con entrada de 2 V pico pide 8 V pico; con 4 V pico pide 16 V. Con rieles ideales de ±12 V el segundo caso se recorta. La energía de salida viene de la alimentación, no de crear energía en la señal.",
      "en": "An ideal non-inverting amplifier has Rg = 10 kΩ and Rf = 30 kΩ: G = 1 + 30/10 = 4. A 2 V peak input requests 8 V peak output; a 4 V peak input requests 16 V. With ideal ±12 V rails, the second case clips. Output energy comes from the power supply, not from creating energy in the signal."
    },
    "diagnosis": {
      "es": "Si la salida se recorta, mide entrada, ganancia y alimentación. Reducir la entrada puede quitar el recorte sin corregir una resistencia de realimentación equivocada. Una salida parecida puede tener dos causas diferentes.",
      "en": "For clipping, measure input, gain and supply. Reducing input may remove clipping without correcting a wrong feedback resistor. Similar outputs can have different causes."
    },
    "experiment": {
      "es": "En el operacional cambia primero amplitud manteniendo ganancia; luego cambia ganancia manteniendo amplitud. Anota el producto G·Vp y si excede el límite. En trifásica compara las tres ondas en un mismo instante, no sus máximos separados.",
      "en": "In the op-amp lab vary amplitude at fixed gain, then gain at fixed amplitude. Record G·Vp and whether it exceeds the limit. In three-phase lessons compare all waves at one instant, not their separate maxima."
    },
    "question": {
      "es": "Con ganancia 4 y límite ideal de salida ±12 V, ¿cuál es la mayor entrada senoidal pico sin recorte?",
      "en": "With gain 4 and an ideal output limit of ±12 V, what is the greatest unclipped sine-wave input peak?"
    },
    "answer": {
      "es": "12/4 = 3 V pico en el modelo ideal. Un dispositivo real puede necesitar margen adicional por excursión de salida, rango de entrada, carga, frecuencia y slew rate.",
      "en": "12/4 = 3 V peak in the ideal model. A real device may need additional margin for output swing, input range, load, frequency and slew rate."
    },
    "misconception": {
      "es": "400 V entre líneas no significan 400 V en cada carga conectada en estrella: en un sistema equilibrado son 400/√3 ≈ 231 V fase-neutro.",
      "en": "400 V line-to-line does not mean 400 V across each star-connected load: a balanced system gives 400/√3 ≈ 231 V phase-to-neutral."
    },
    "boundary": {
      "es": "Las relaciones de estrella requieren equilibrio y la referencia correcta. Practica con los modelos; el esquema didáctico no es una instrucción para medir red eléctrica energizada.",
      "en": "Star relationships require balance and the correct reference. Practise in the models; the teaching diagram is not an instruction to probe live mains."
    }
  },
  "electromechanics": {
    "title": {
      "es": "Electromecánica: conectar campo, velocidad y carga",
      "en": "Electromechanics: connect field, speed and load"
    },
    "prerequisite": {
      "es": "Repasa corriente alterna, fase, torque y potencia. Diferencia velocidad angular de frecuencia eléctrica.",
      "en": "Review AC, phase, torque and power. Distinguish angular speed from electrical frequency."
    },
    "route": {
      "es": "Campo y bobinas → inducción → alternador → campo giratorio → deslizamiento → transmisión → contactor y mando → balance de energía.",
      "en": "Fields and coils → induction → alternator → rotating field → slip → transmission → contactor and control → energy balance."
    },
    "reasoning": {
      "es": "En un generador, el cambio de flujo enlazado induce tensión. En un motor de inducción, el campo del estator gira a velocidad síncrona y el rotor necesita deslizamiento para desarrollar torque como motor. Frecuencia eléctrica, número de polos y velocidad mecánica están relacionados, pero no son intercambiables.",
      "en": "In a generator, changing linked magnetic flux induces voltage. In an induction motor, the stator field rotates at synchronous speed and the rotor needs slip to develop motoring torque. Electrical frequency, pole count and mechanical speed are related but not interchangeable."
    },
    "example": {
      "es": "A 50 Hz con cuatro polos, ns = 120 × 50/4 = 1 500 rpm. Si el rotor gira a 1 440 rpm, s = (1 500 − 1 440)/1 500 = 0,04 = 4 %. Con torque de 10 N·m, la potencia de eje es 10 × 2π × 1 440/60 ≈ 1 508 W. Con rendimiento de 0,80 se necesitan aproximadamente 1 885 W eléctricos de entrada.",
      "en": "At 50 Hz with four poles, ns = 120 × 50/4 = 1,500 rpm. With rotor speed 1,440 rpm, s = (1,500 − 1,440)/1,500 = 0.04 = 4%. At 10 N·m, shaft power is 10 × 2π × 1,440/60 ≈ 1,508 W. At efficiency 0.80, electrical input is approximately 1,885 W."
    },
    "diagnosis": {
      "es": "Un rotor más lento puede indicar mayor carga, alimentación inadecuada u otra condición. Compara velocidad, carga y variables eléctricas; una sola lectura no distingue todas las causas. Si la bobina del contactor recibe mando pero el motor no responde, separa el circuito de mando del de potencia.",
      "en": "A slower rotor can indicate greater load, inadequate supply or another condition. Compare speed, load and electrical quantities; one reading cannot distinguish every cause. If the contactor coil receives a command but the motor does not respond, separate the control circuit from the power circuit."
    },
    "experiment": {
      "es": "En el laboratorio del motor identifica campo y rotor. Cambia frecuencia y predice la velocidad síncrona antes de mirar. En transmisión, calcula potencia de entrada y salida: no supongas que una reducción crea energía.",
      "en": "In the motor lab identify field and rotor. Change frequency and predict synchronous speed before looking. For a transmission, calculate input and output power rather than assuming that reduction creates energy."
    },
    "question": {
      "es": "Con 50 Hz y seis polos, ¿cuál es la velocidad síncrona? ¿Debe el rotor bajo carga alcanzarla exactamente?",
      "en": "At 50 Hz with six poles, what is synchronous speed? Must a loaded rotor reach it exactly?"
    },
    "answer": {
      "es": "ns = 120 × 50/6 = 1 000 rpm. Un motor de inducción bajo carga normalmente gira algo por debajo en funcionamiento motor; a velocidad síncrona ideal no habría movimiento relativo para inducir corriente de rotor.",
      "en": "ns = 120 × 50/6 = 1,000 rpm. A loaded induction motor normally runs slightly below this in motoring operation; at ideal synchronous speed there would be no relative motion to induce rotor current."
    },
    "misconception": {
      "es": "La velocidad indicada por el campo giratorio no es necesariamente la del rotor. Cambiar el orden de fases cambia el sentido, no el número de polos.",
      "en": "The rotating field speed is not necessarily rotor speed. Changing phase sequence changes direction, not pole count."
    },
    "boundary": {
      "es": "El modelo no predice límites térmicos, curvas reales de torque ni compatibilidad de variadores. Usa placa, curva y documentación del equipo para seleccionar componentes.",
      "en": "The model does not predict thermal limits, real torque curves or drive compatibility. Use the equipment nameplate, curves and documentation for component selection."
    }
  },
  "pneumatics": {
    "title": {
      "es": "Neumática: no olvides el aire que debe salir",
      "en": "Pneumatics: account for the air that must escape"
    },
    "prerequisite": {
      "es": "Convierte bar a Pa y mm a m. Distingue presión manométrica de absoluta y fuerza de velocidad.",
      "en": "Convert bar to Pa and mm to m. Distinguish gauge from absolute pressure and force from speed."
    },
    "route": {
      "es": "Compresión y temperatura → preparación de aire → regulación → vías y posiciones → doble efecto → caudal y escape → sensores → diagnóstico.",
      "en": "Compression and temperature → air preparation → regulation → ports and positions → double acting cylinders → flow and exhaust → sensors → diagnosis."
    },
    "reasoning": {
      "es": "El aire almacena energía al comprimirse. Un regulador reduce y controla presión aguas abajo; no crea caudal ilimitado. Para mover un cilindro debes alimentar una cámara y permitir que la otra descargue. La fuerza neta depende de ambas presiones, sus áreas y la fricción; conocer solo la presión de entrada no basta.",
      "en": "Air stores energy when compressed. A regulator reduces and controls downstream pressure; it does not create unlimited flow. Moving a cylinder requires feeding one chamber while allowing the other to discharge. Net force depends on both pressures, their areas and friction; inlet pressure alone is insufficient."
    },
    "example": {
      "es": "Cilindro de 40 mm de diámetro y vástago de 16 mm: A = π·0,04²/4 = 0,001257 m² y área anular = π·(0,04² − 0,016²)/4 = 0,001056 m². Con 4 bar manométricos y escape atmosférico, las fuerzas ideales son 503 N al avanzar y 422 N al regresar. Si el escape durante avance tiene 1 bar de contrapresión, F ≈ 503 − 106 = 397 N, antes de fricción.",
      "en": "A 40 mm bore with a 16 mm rod has A = π·0.04²/4 = 0.001257 m² and annular area = π·(0.04² − 0.016²)/4 = 0.001056 m². At 4 bar gauge with atmospheric exhaust, ideal forces are 503 N extending and 422 N retracting. With 1 bar exhaust backpressure during extension, F ≈ 503 − 106 = 397 N before friction."
    },
    "diagnosis": {
      "es": "Si el cilindro se mueve lento, compara alimentación durante movimiento, presión de escape, orden de válvula y sensores. Presión baja y escape restringido pueden parecer iguales en la posición final. Mide mientras ocurre el síntoma y prueba ambos sentidos.",
      "en": "For slow motion, compare supply during movement, exhaust pressure, valve command and sensors. Low supply and restricted exhaust can look similar at the end position. Measure while the symptom occurs and test both directions."
    },
    "experiment": {
      "es": "En los bancos compara presión de entrada y escape al mismo tiempo. Predice qué ocurre al eliminar una obstrucción sin cambiar el regulador. En una 5/2, sigue suministro → cámara y cámara opuesta → escape para cada posición.",
      "en": "Compare supply and exhaust pressure simultaneously in the benches. Predict what clearing a restriction will change without adjusting the regulator. For a 5/2 valve, follow supply → chamber and opposite chamber → exhaust in both positions."
    },
    "question": {
      "es": "¿Por qué un cilindro puede tener alimentación correcta y aun así producir poca fuerza?",
      "en": "Why can a cylinder have correct supply pressure but still produce little force?"
    },
    "answer": {
      "es": "La contrapresión en la cámara opuesta resta fuerza; también puede haber fricción o carga excesiva. Una presión de entrada correcta no demuestra que el circuito de escape esté libre.",
      "en": "Backpressure in the opposing chamber subtracts force; friction or excessive load may also contribute. Correct inlet pressure does not prove a clear exhaust path."
    },
    "misconception": {
      "es": "Boyle usa presión absoluta y temperatura constante. Para fuerza con escape atmosférico suele bastar presión manométrica; no mezcles estas referencias.",
      "en": "Boyle uses absolute pressure and constant temperature. Force with atmospheric exhaust often uses gauge pressure; do not mix these references."
    },
    "boundary": {
      "es": "Los caudales referidos a aire libre no equivalen directamente al volumen dentro del cilindro presurizado. La animación no reemplaza el cálculo dinámico ni la descarga segura del equipo real.",
      "en": "Free-air flow ratings are not directly equivalent to volume inside a pressurised cylinder. Animation does not replace dynamic calculations or safe discharge of real equipment."
    }
  },
  "fluids": {
    "title": {
      "es": "Fluidos e hidráulica: seguir fuerza, caudal y energía",
      "en": "Fluids and hydraulics: track force, flow and energy"
    },
    "prerequisite": {
      "es": "Repasa área, volumen, presión y potencia. 1 bar = 100 000 Pa; 1 L/min = 1/60 000 m³/s.",
      "en": "Review area, volume, pressure and power. 1 bar = 100,000 Pa; 1 L/min = 1/60,000 m³/s."
    },
    "route": {
      "es": "Presión hidrostática → Pascal → continuidad → bomba y carga → fuerza/velocidad → pérdidas → alivio → fugas y cavitación.",
      "en": "Hydrostatic pressure → Pascal → continuity → pump and load → force/speed → losses → relief → leakage and cavitation."
    },
    "reasoning": {
      "es": "La presión es fuerza por área; el caudal es volumen por tiempo. Una bomba aporta caudal y la carga/resistencia determina la presión necesaria dentro de los límites del sistema. En líquido ideal incomprensible, Q = Av. Un alivio limita presión enviando caudal al tanque; ese retorno puede disipar potencia en calor.",
      "en": "Pressure is force per area; flow is volume per time. A pump supplies flow and load/resistance determines required pressure within system limits. For an ideal incompressible liquid, Q = Av. A relief valve limits pressure by returning flow to tank; this return can dissipate power as heat."
    },
    "example": {
      "es": "Un actuador ideal con área efectiva de 10 cm² y carga de 4 kN requiere p = 4 000/0,001 = 4 MPa = 40 bar. Con Q = 6 L/min = 0,0001 m³/s, v = Q/A = 0,10 m/s. La potencia hidráulica es pQ = 400 W, igual a Fv. Si 2 L/min se fugan a tanque a esa presión, quedan 4 L/min útiles: v ≈ 0,067 m/s y unos 133 W se disipan en la fuga.",
      "en": "An ideal actuator with effective area 10 cm² and load 4 kN requires p = 4,000/0.001 = 4 MPa = 40 bar. At Q = 6 L/min = 0.0001 m³/s, v = Q/A = 0.10 m/s. Hydraulic power pQ = 400 W equals Fv. If 2 L/min leaks to tank at that pressure, 4 L/min remains useful: v ≈ 0.067 m/s and about 133 W is dissipated in the leak."
    },
    "diagnosis": {
      "es": "Un cilindro lento puede deberse a caudal de bomba bajo, fuga o derivación por alivio. Compara caudal de entrada, fuga/retorno y presión; evita subir el alivio como primera respuesta. Si el cilindro se detiene, verifica si la fuerza disponible supera la carga.",
      "en": "A slow cylinder may indicate low pump flow, leakage or relief diversion. Compare inlet flow, leakage/return and pressure; do not start by increasing relief pressure. If it stops, check whether available force exceeds the load."
    },
    "experiment": {
      "es": "En el banco de alivio aumenta la carga manteniendo caudal y ajuste. Predice cuándo deja de avanzar y observa dónde retorna el aceite. Haz un balance: caudal de bomba = caudal útil + fuga + derivaciones presentes. No inventes ramas que el modelo no tiene.",
      "en": "In the relief bench raise load while holding flow and setting fixed. Predict when motion stops and observe the oil return. Balance pump flow = useful flow + leakage + any other diversion present. Do not invent branches absent from the model."
    },
    "question": {
      "es": "Si el caudal útil se reduce a la mitad con la misma área, ¿se reduce también la fuerza ideal a la mitad?",
      "en": "If useful flow halves at the same area, must ideal force halve as well?"
    },
    "answer": {
      "es": "La velocidad se reduce a la mitad. La fuerza depende de la diferencia de presión y las áreas; sin conocer cómo cambió la presión no puedes afirmar que la fuerza se redujo.",
      "en": "Speed halves. Force depends on pressure difference and areas; without knowing how pressure changed you cannot conclude that force halved."
    },
    "misconception": {
      "es": "Pascal no crea energía: un pistón de mayor área aumenta fuerza a cambio de desplazamiento. Bernoulli ideal no incluye automáticamente pérdidas ni bombas.",
      "en": "Pascal does not create energy: a larger piston area increases force at the expense of displacement. Ideal Bernoulli does not automatically include losses or pumps."
    },
    "boundary": {
      "es": "El ejemplo utiliza un área efectiva única y no modela fricción. Un cilindro real de vástago simple tiene áreas diferentes. Para cavitación compara presión absoluta con presión de vapor a la temperatura real.",
      "en": "The example uses one effective area and neglects friction. A real single-rod cylinder has unequal areas. For cavitation, compare absolute pressure with vapour pressure at the actual temperature."
    }
  },
  "mechatronics": {
    "title": {
      "es": "Mecatrónica: separar orden, señal y movimiento",
      "en": "Mechatronics: separate command, signal and motion"
    },
    "prerequisite": {
      "es": "Repasa sensores binarios, actuadores y lógica AND/OR. Un bit representa una interpretación de una señal, no la posición física en sí.",
      "en": "Review binary sensors, actuators and AND/OR logic. A bit is an interpretation of a signal, not physical position itself."
    },
    "route": {
      "es": "Entradas/salidas → ciclo de PLC → estados y transiciones → ladder → temporizador y contador → HMI → diagnóstico temporal y fallos combinados.",
      "en": "Inputs/outputs → PLC cycle → states and transitions → ladder → timer and counter → HMI → time-based diagnosis and combined faults."
    },
    "reasoning": {
      "es": "Un PLC lee entradas, ejecuta lógica y actualiza salidas según su arquitectura. Una salida activa expresa un mando; no confirma movimiento. La secuencia A+ B+ B− A− necesita estados que recuerden en qué etapa está. Un sensor debe habilitar la transición adecuada, no cualquier movimiento cada vez que se activa.",
      "en": "A PLC reads inputs, executes logic and updates outputs according to its architecture. An active output is a command, not proof of motion. A+ B+ B− A− needs states that remember the current stage. A sensor should enable the appropriate transition rather than command arbitrary motion whenever active."
    },
    "example": {
      "es": "Estado 1 ordena A+ y espera a1. Estado 2 ordena B+ y espera b1. Estado 3 ordena B− y espera b0. Estado 4 ordena A− y espera a0. El contador suma una vez al completar el último paso, no en cada lectura de a0. Si el PLC evalúa a0 cien veces mientras sigue activo, eso no equivale a cien ciclos.",
      "en": "State 1 commands A+ and waits for a1. State 2 commands B+ and waits for b1. State 3 commands B− and waits for b0. State 4 commands A− and waits for a0. The counter increments once on completion of the last stage, not on every reading of a0. Evaluating an active a0 a hundred times does not mean a hundred cycles."
    },
    "diagnosis": {
      "es": "Salida activa + pistón detenido + sensor final apagado puede indicar falta de presión o atasco. Pistón al final + sensor apagado orienta a sensor/cableado, pero debes comprobar alimentación y señal. Usa un registro temporal: posición física, entrada al PLC, estado lógico y salida. Correlación temporal ayuda; no prueba por sí sola causalidad.",
      "en": "Active output + stationary piston + inactive end sensor may indicate low pressure or a jam. Piston at its end + inactive sensor points toward sensor/wiring, but supply and signal still need checking. Record physical position, PLC input, logic state and output over time. Temporal correlation helps; it does not establish causation by itself."
    },
    "experiment": {
      "es": "En el ladder y HMI sincronizados, pausa antes de a1. Predice qué contacto y salida cambiarán. Luego introduce un fallo intermitente y recorre el cursor antes, durante y después. Separa la primera señal anormal de las consecuencias posteriores.",
      "en": "In synchronized ladder and HMI views, pause before a1. Predict which contact and output will change. Then introduce an intermittent fault and scrub before, during and after it. Separate the first abnormal signal from its later consequences."
    },
    "question": {
      "es": "Si A llegó al final pero a1 sigue en cero, ¿debería el programa saltar a B+ solo porque pasó mucho tiempo?",
      "en": "If A has reached its end but a1 remains zero, should the program jump to B+ merely because enough time passed?"
    },
    "answer": {
      "es": "No debe asumir confirmación de posición. Un timeout puede generar alarma o una acción definida por el diseño; no reemplaza automáticamente la evidencia del sensor. La reacción segura depende de la máquina.",
      "en": "It should not assume position confirmation. A timeout may trigger an alarm or a designed response; it does not automatically replace sensor evidence. The safe response depends on the machine."
    },
    "misconception": {
      "es": "Un contacto ladder normalmente cerrado es una prueba lógica del bit, no necesariamente un sensor físico de contacto cerrado.",
      "en": "A normally closed ladder contact is a logical test of a bit, not necessarily a physically closed sensor contact."
    },
    "boundary": {
      "es": "Un PLC y una parada dibujados en una simulación no constituyen un sistema de seguridad validado. Los tiempos, prioridades, enclavamientos y estados ante pérdida de energía deben definirse para el equipo real.",
      "en": "A simulated PLC and stop button do not constitute a validated safety system. Timing, priorities, interlocks and power-loss states must be defined for the real equipment."
    }
  },
  "bicycles": {
    "title": {
      "es": "Mecánica de bicicletas: ajustar con una hipótesis",
      "en": "Bicycle mechanics: adjust with a hypothesis"
    },
    "prerequisite": {
      "es": "Identifica transmisión, dirección, ruedas y frenos antes de ajustar. Usa la referencia exacta del componente para compatibilidad y límites.",
      "en": "Identify drivetrain, steering, wheels and brakes before adjusting. Use the exact component reference for compatibility and limits."
    },
    "route": {
      "es": "Inspección y herramientas → limpieza y lubricación → cadena y cierres → frenos → ruedas → cambios → rodamientos → suspensión → diagnóstico y comprobación final.",
      "en": "Inspection and tools → cleaning and lubrication → chain and joining → brakes → wheels → shifting → bearings → suspension → diagnosis and final checks."
    },
    "reasoning": {
      "es": "La indexación alinea cada posición del mando con una corona. Los topes H y L limitan recorrido en los extremos; no corrigen todos los cambios intermedios. La separación B, la alineación de patilla y la fricción de guaya influyen de maneras distintas. Compara subir y bajar marchas: una respuesta diferente según sentido sugiere histéresis o fricción, aunque no la demuestra por sí sola.",
      "en": "Indexing aligns each shifter position with a sprocket. H and L stops limit travel at the ends; they do not correct all intermediate shifts. B-gap, hanger alignment and cable friction have different effects. Compare shifting up and down: direction-dependent behaviour suggests hysteresis or friction, though it does not prove either alone."
    },
    "example": {
      "es": "Plato de 32 dientes y corona de 16: la rueda gira dos vueltas por vuelta de biela. Con 60 rpm de cadencia y circunferencia de rueda de 2,10 m, velocidad ideal = 60 × 2 × 2,10 = 252 m/min = 15,12 km/h. Con corona de 32 queda en 7,56 km/h. No has duplicado energía: has intercambiado velocidad por ventaja mecánica.",
      "en": "A 32-tooth chainring and 16-tooth sprocket give two wheel revolutions per crank revolution. At 60 rpm cadence and 2.10 m wheel circumference, ideal speed = 60 × 2 × 2.10 = 252 m/min = 15.12 km/h. A 32-tooth sprocket gives 7.56 km/h. Energy has not doubled: speed is exchanged for mechanical advantage."
    },
    "diagnosis": {
      "es": "Si un cambio funciona al subir pero falla al bajar, compara recorrido del mando y retorno del desviador antes de girar topes. Si una zona del cassette queda bien y otra mal, revisa alineación y compatibilidad. En frenos, separa recorrido de maneta, centrado, fricción y capacidad real de frenado.",
      "en": "If shifting works one way but fails on return, compare shifter travel and derailleur return before turning limit screws. If one cassette region works and another does not, check alignment and compatibility. For brakes, separate lever travel, centring, friction and actual braking capacity."
    },
    "experiment": {
      "es": "En el taller de cambios registra las siete marchas en ambos sentidos. Introduce solo un fallo, anota su patrón y luego compara con uno combinado. Tras reparar la guaya, vuelve a comprobar toda la gama: una patilla doblada puede seguir causando errores.",
      "en": "In the shifting workshop record all seven gears in both directions. Introduce one fault, note its pattern and then compare a combined case. After repairing the cable, check the entire range again: a bent hanger may still cause errors."
    },
    "question": {
      "es": "¿Por qué no basta con que una sola marcha cambie bien después del ajuste?",
      "en": "Why is one successful shift insufficient after adjustment?"
    },
    "answer": {
      "es": "Porque un ajuste puede compensar un error en un punto y empeorar otros. Hay que comprobar extremos, marchas intermedias y ambos sentidos, además del montaje y condiciones que el modelo no reproduce.",
      "en": "An adjustment may compensate an error at one point while worsening others. Check end gears, intermediate gears and both directions, as well as assembly and conditions the model does not reproduce."
    },
    "misconception": {
      "es": "No existe un número universal de vueltas de tornillo B ni una holgura válida para todos los desviadores. Un tope no sustituye una indexación correcta.",
      "en": "There is no universal number of B-screw turns or gap for every derailleur. A limit stop does not replace correct indexing."
    },
    "boundary": {
      "es": "El laboratorio no certifica frenado, integridad estructural ni pares de apriete reales. Usa las instrucciones del modelo exacto; un despiece muestra relaciones, no un procedimiento universal de desmontaje.",
      "en": "The lab does not certify braking, structural integrity or real tightening torques. Follow instructions for the exact model; an exploded view shows relationships, not a universal disassembly procedure."
    }
  }
};
