export const practice = {
  "torque": {
    "title": {
      "en": "Angle matters",
      "es": "El ángulo importa"
    },
    "scene": {
      "en": "A 0.25 m wrench receives 80 N at 30° to its handle. Treat it as rigid.",
      "es": "Una llave de 0,25 m recibe 80 N a 30° del mango. Supón que es rígida."
    },
    "steps": [
      {
        "en": "The perpendicular force is 80 sin(30°) = 40 N.",
        "es": "La fuerza perpendicular es 80 sen(30°) = 40 N."
      },
      {
        "en": "Torque is 0.25 × 40 = 10 N·m, not 20 N·m.",
        "es": "El torque es 0,25 × 40 = 10 N·m, no 20 N·m."
      }
    ],
    "question": {
      "en": "What changes if the same force becomes perpendicular?",
      "es": "¿Qué cambia si la misma fuerza queda perpendicular?"
    },
    "options": [
      {
        "en": "Torque becomes 20 N·m",
        "es": "El torque pasa a 20 N·m"
      },
      {
        "en": "Torque stays 10 N·m",
        "es": "El torque sigue en 10 N·m"
      },
      {
        "en": "Torque becomes zero",
        "es": "El torque pasa a cero"
      }
    ],
    "correct": 0,
    "why": [
      {
        "en": "Yes: sin(90°) = 1; all of the force contributes.",
        "es": "Sí: sen(90°) = 1; toda la fuerza contribuye."
      },
      {
        "en": "The angle changes the effective lever arm, even though force is unchanged.",
        "es": "El ángulo cambia el brazo efectivo aunque la fuerza no cambie."
      },
      {
        "en": "Zero torque occurs when the force line passes through the axis.",
        "es": "El torque es cero cuando la línea de fuerza pasa por el eje."
      }
    ]
  },
  "fourstroke": {
    "title": {
      "en": "From rpm to combustion events",
      "es": "De rpm a combustiones"
    },
    "scene": {
      "en": "A single-cylinder four-stroke engine turns steadily at 2400 rpm. Assume every cycle fires.",
      "es": "Un motor monocilíndrico de cuatro tiempos gira a 2400 rpm. Supón combustión en cada ciclo."
    },
    "steps": [
      {
        "en": "2400/60 = 40 crankshaft revolutions each second.",
        "es": "2400/60 = 40 vueltas de cigüeñal por segundo."
      },
      {
        "en": "One cycle takes two revolutions: 20 power strokes per second.",
        "es": "Un ciclo necesita dos vueltas: 20 carreras de expansión por segundo."
      }
    ],
    "question": {
      "en": "At 1200 rpm, how many power strokes occur each second?",
      "es": "A 1200 rpm, ¿cuántas carreras de expansión hay por segundo?"
    },
    "options": [
      {
        "en": "40",
        "es": "40"
      },
      {
        "en": "20",
        "es": "20"
      },
      {
        "en": "10",
        "es": "10"
      }
    ],
    "correct": 2,
    "why": [
      {
        "en": "This counts too many events: divide rpm by 60 and then by 2.",
        "es": "Sobran eventos: divide rpm entre 60 y después entre 2."
      },
      {
        "en": "20 is revolutions per second, not four-stroke cycles per second.",
        "es": "20 son vueltas por segundo, no ciclos de cuatro tiempos."
      },
      {
        "en": "Correct: 1200/60/2 = 10. Speed changes timing, not the four-stroke sequence.",
        "es": "Correcto: 1200/60/2 = 10. La velocidad cambia el tiempo, no la secuencia."
      }
    ]
  },
  "transmission": {
    "title": {
      "en": "Account for losses",
      "es": "Contar las pérdidas"
    },
    "scene": {
      "en": "A 20-tooth driver turns a 60-tooth gear. Input: 900 rpm and 4 N·m; efficiency: 90%.",
      "es": "Un engranaje conductor de 20 dientes mueve uno de 60. Entrada: 900 rpm y 4 N·m; eficiencia: 90 %."
    },
    "steps": [
      {
        "en": "Output speed = 900 × 20/60 = 300 rpm.",
        "es": "Velocidad de salida = 900 × 20/60 = 300 rpm."
      },
      {
        "en": "Output torque = 4 × 3 × 0.90 = 10.8 N·m. The missing power becomes losses.",
        "es": "Torque de salida = 4 × 3 × 0,90 = 10,8 N·m. La potencia restante son pérdidas."
      }
    ],
    "question": {
      "en": "With efficiency reduced to 80%, what is output torque at the same input?",
      "es": "Con eficiencia del 80 %, ¿cuál es el torque de salida con la misma entrada?"
    },
    "options": [
      {
        "en": "12 N·m",
        "es": "12 N·m"
      },
      {
        "en": "9.6 N·m",
        "es": "9,6 N·m"
      },
      {
        "en": "15 N·m",
        "es": "15 N·m"
      }
    ],
    "correct": 1,
    "why": [
      {
        "en": "12 N·m assumes no losses.",
        "es": "12 N·m supone ausencia de pérdidas."
      },
      {
        "en": "Correct: 4 × 3 × 0.80 = 9.6 N·m.",
        "es": "Correcto: 4 × 3 × 0,80 = 9,6 N·m."
      },
      {
        "en": "Dividing by efficiency would create output power instead of losing it.",
        "es": "Dividir entre eficiencia crearía potencia de salida en vez de perderla."
      }
    ]
  },
  "thermal": {
    "title": {
      "en": "Heat accumulation",
      "es": "Acumulación de calor"
    },
    "scene": {
      "en": "A simplified cooling system receives 12 kW and rejects 9 kW. Its effective heat capacity is 60 kJ/°C.",
      "es": "Un sistema de refrigeración simplificado recibe 12 kW y evacúa 9 kW. Su capacidad térmica efectiva es 60 kJ/°C."
    },
    "steps": [
      {
        "en": "Net heating = 12 − 9 = 3 kJ/s.",
        "es": "Calentamiento neto = 12 − 9 = 3 kJ/s."
      },
      {
        "en": "Over 120 s it stores 360 kJ: temperature rises 360/60 = 6°C. Assume constant rates and no phase change.",
        "es": "En 120 s almacena 360 kJ: sube 360/60 = 6 °C. Supón tasas constantes y sin cambio de fase."
      }
    ],
    "question": {
      "en": "If rejection rises to 12 kW, what happens next in this model?",
      "es": "Si la evacuación sube a 12 kW, ¿qué pasa en este modelo?"
    },
    "options": [
      {
        "en": "Temperature immediately returns to its initial value",
        "es": "La temperatura vuelve inmediatamente al valor inicial"
      },
      {
        "en": "Temperature keeps rising at the same rate",
        "es": "La temperatura sigue subiendo al mismo ritmo"
      },
      {
        "en": "Temperature stops rising",
        "es": "La temperatura deja de subir"
      }
    ],
    "correct": 2,
    "why": [
      {
        "en": "Equal rates stop accumulation; they do not remove the energy already stored.",
        "es": "Tasas iguales detienen la acumulación; no eliminan la energía almacenada."
      },
      {
        "en": "The net heat input is now zero.",
        "es": "La entrada neta de calor ahora es cero."
      },
      {
        "en": "Correct. Cooling down requires rejection greater than input.",
        "es": "Correcto. Para enfriar, la evacuación debe superar la entrada."
      }
    ]
  },
  "nostart": {
    "title": {
      "en": "Locate the voltage loss",
      "es": "Localizar la caída de tensión"
    },
    "scene": {
      "en": "During cranking, battery terminals read 11.2 V, positive cable drop 0.2 V and ground-path drop 1.1 V. These are example readings, not universal limits.",
      "es": "Durante el arranque, la batería marca 11,2 V, la caída positiva 0,2 V y la de masa 1,1 V. Son lecturas de ejemplo, no límites universales."
    },
    "steps": [
      {
        "en": "Voltage available at the starter is 11.2 − 0.2 − 1.1 = 9.9 V.",
        "es": "El arranque recibe 11,2 − 0,2 − 1,1 = 9,9 V."
      },
      {
        "en": "The ground path loses most voltage. Localise the drop across its connections under the same demand.",
        "es": "La masa pierde más tensión. Localiza la caída en sus conexiones bajo la misma demanda."
      }
    ],
    "question": {
      "en": "If the ground drop becomes 0.1 V with other readings unchanged, what reaches the starter?",
      "es": "Si la caída de masa pasa a 0,1 V y lo demás no cambia, ¿qué recibe el arranque?"
    },
    "options": [
      {
        "en": "10.9 V",
        "es": "10,9 V"
      },
      {
        "en": "11.2 V",
        "es": "11,2 V"
      },
      {
        "en": "9.9 V",
        "es": "9,9 V"
      }
    ],
    "correct": 0,
    "why": [
      {
        "en": "Correct: 11.2 − 0.2 − 0.1 = 10.9 V. Repeat the loaded test to verify.",
        "es": "Correcto: 11,2 − 0,2 − 0,1 = 10,9 V. Repite la prueba bajo carga."
      },
      {
        "en": "The remaining cable drops still subtract from terminal voltage.",
        "es": "Las caídas restantes aún se restan a la tensión de batería."
      },
      {
        "en": "That was the original result before the ground-path improvement.",
        "es": "Ese era el resultado anterior a mejorar la masa."
      }
    ]
  },
  "ohm": {
    "title": {
      "en": "Series versus parallel",
      "es": "Serie y paralelo"
    },
    "scene": {
      "en": "Two 100 Ω resistors connect to an ideal 10 V DC source.",
      "es": "Dos resistencias de 100 Ω se conectan a una fuente ideal de 10 V DC."
    },
    "steps": [
      {
        "en": "In series, R = 200 Ω and source current = 10/200 = 0.05 A.",
        "es": "En serie, R = 200 Ω y corriente de fuente = 10/200 = 0,05 A."
      },
      {
        "en": "In parallel, each branch draws 0.1 A; the source supplies 0.2 A.",
        "es": "En paralelo, cada rama consume 0,1 A; la fuente entrega 0,2 A."
      }
    ],
    "question": {
      "en": "One parallel branch opens. What happens to current in the remaining branch?",
      "es": "Una rama paralela se abre. ¿Qué pasa con la corriente de la otra?"
    },
    "options": [
      {
        "en": "It doubles",
        "es": "Se duplica"
      },
      {
        "en": "It remains 0.1 A",
        "es": "Sigue en 0,1 A"
      },
      {
        "en": "It becomes zero",
        "es": "Pasa a cero"
      }
    ],
    "correct": 1,
    "why": [
      {
        "en": "An ideal voltage source keeps the remaining branch at 10 V, not 20 V.",
        "es": "Una fuente ideal mantiene 10 V en la rama restante, no 20 V."
      },
      {
        "en": "Correct: its voltage and resistance are unchanged. Total source current halves.",
        "es": "Correcto: su tensión y resistencia no cambian. La corriente total se reduce a la mitad."
      },
      {
        "en": "Only the opened branch loses its closed path.",
        "es": "Solo la rama abierta pierde su camino cerrado."
      }
    ]
  },
  "ac": {
    "title": {
      "en": "Read a waveform quantitatively",
      "es": "Leer una onda con números"
    },
    "scene": {
      "en": "A zero-offset sine wave has 10 V peak and a 20 ms period across 100 Ω.",
      "es": "Una senoidal sin offset tiene pico de 10 V y periodo de 20 ms sobre 100 Ω."
    },
    "steps": [
      {
        "en": "Frequency = 1/0.020 = 50 Hz; RMS voltage = 10/√2 ≈ 7.07 V.",
        "es": "Frecuencia = 1/0,020 = 50 Hz; tensión RMS = 10/√2 ≈ 7,07 V."
      },
      {
        "en": "Average resistor power = Vrms²/R = 50/100 = 0.5 W.",
        "es": "Potencia media resistiva = Vrms²/R = 50/100 = 0,5 W."
      }
    ],
    "question": {
      "en": "If peak voltage doubles while R is fixed, what is average power?",
      "es": "Si el pico se duplica con R fija, ¿cuál es la potencia media?"
    },
    "options": [
      {
        "en": "1 W",
        "es": "1 W"
      },
      {
        "en": "0.5 W",
        "es": "0,5 W"
      },
      {
        "en": "2 W",
        "es": "2 W"
      }
    ],
    "correct": 2,
    "why": [
      {
        "en": "Power depends on voltage squared, not voltage alone.",
        "es": "La potencia depende del cuadrado de la tensión."
      },
      {
        "en": "The waveform amplitude changed, so RMS and heating change too.",
        "es": "Cambió la amplitud: también cambian RMS y calentamiento."
      },
      {
        "en": "Correct: doubling voltage quadruples power to 2 W.",
        "es": "Correcto: duplicar tensión cuadruplica potencia a 2 W."
      }
    ]
  },
  "threephase": {
    "title": {
      "en": "Instantaneous phase balance",
      "es": "Balance instantáneo de fases"
    },
    "scene": {
      "en": "Three balanced sinusoidal phase currents have a 10 A peak and 120° spacing. Let iA = 10 sin θ.",
      "es": "Tres corrientes senoidales equilibradas tienen pico de 10 A y separación de 120°. Sea iA = 10 sen θ."
    },
    "steps": [
      {
        "en": "At θ = 90°, iA = 10 A, iB = 10 sin(−30°) = −5 A, iC = 10 sin(−150°) = −5 A.",
        "es": "A θ = 90°, iA = 10 A, iB = 10 sen(−30°) = −5 A, iC = 10 sen(−150°) = −5 A."
      },
      {
        "en": "Their instantaneous sum is zero. Negative current means opposite direction to the chosen reference.",
        "es": "La suma instantánea es cero. Corriente negativa significa dirección contraria a la referencia."
      }
    ],
    "question": {
      "en": "Does zero neutral current mean the loads receive no power?",
      "es": "¿Corriente de neutro cero significa que las cargas no reciben potencia?"
    },
    "options": [
      {
        "en": "No: phase currents can transfer power while summing to zero",
        "es": "No: las corrientes de fase pueden transferir potencia y sumar cero"
      },
      {
        "en": "Yes: all phase currents are zero",
        "es": "Sí: todas las corrientes de fase son cero"
      },
      {
        "en": "Yes: negative current cancels all energy",
        "es": "Sí: la corriente negativa cancela toda la energía"
      }
    ],
    "correct": 0,
    "why": [
      {
        "en": "Correct. Neutral balance is a current-sum statement, not a zero-power statement.",
        "es": "Correcto. El balance del neutro describe suma de corrientes, no potencia nula."
      },
      {
        "en": "The readings explicitly show nonzero phase currents.",
        "es": "Las lecturas muestran corrientes de fase distintas de cero."
      },
      {
        "en": "Power depends on voltage times current in each phase, not current alone.",
        "es": "La potencia depende de tensión por corriente en cada fase, no solo corriente."
      }
    ]
  },
  "rectifier": {
    "title": {
      "en": "Estimate capacitor ripple",
      "es": "Estimar rizado del condensador"
    },
    "scene": {
      "en": "A full-wave 50 Hz rectifier feeds 0.1 A into a reservoir capacitor of 1000 μF. Use a small-ripple approximation.",
      "es": "Un rectificador de onda completa a 50 Hz alimenta 0,1 A con condensador de reserva de 1000 μF. Usa aproximación de rizado pequeño."
    },
    "steps": [
      {
        "en": "Recharge pulses occur at 100 Hz, approximately every 0.01 s.",
        "es": "Hay recargas a 100 Hz, aproximadamente cada 0,01 s."
      },
      {
        "en": "ΔV ≈ I/(f ripple × C) = 0.1/(100 × 0.001) = 1 V peak-to-peak. This neglects detailed diode conduction.",
        "es": "ΔV ≈ I/(f rizado × C) = 0,1/(100 × 0,001) = 1 V pico a pico. Se omite la conducción detallada de diodos."
      }
    ],
    "question": {
      "en": "What happens with 2000 μF at the same load?",
      "es": "¿Qué pasa con 2000 μF y la misma carga?"
    },
    "options": [
      {
        "en": "Ripple becomes 2 V",
        "es": "El rizado pasa a 2 V"
      },
      {
        "en": "Ripple becomes about 0.5 V",
        "es": "El rizado pasa a unos 0,5 V"
      },
      {
        "en": "Ripple frequency becomes 200 Hz",
        "es": "La frecuencia del rizado pasa a 200 Hz"
      }
    ],
    "correct": 1,
    "why": [
      {
        "en": "A larger capacitor loses less voltage for the same removed charge.",
        "es": "Un condensador mayor pierde menos tensión para la misma carga extraída."
      },
      {
        "en": "Correct: doubling C halves the approximate ripple. It does not create regulated DC.",
        "es": "Correcto: duplicar C reduce el rizado a la mitad. No crea DC regulada."
      },
      {
        "en": "The rectifier and source set recharge frequency; C changes voltage droop.",
        "es": "El rectificador y la fuente fijan la frecuencia; C cambia la caída de tensión."
      }
    ]
  },
  "opamp": {
    "title": {
      "en": "Distinguish clipping from gain",
      "es": "Distinguir recorte y ganancia"
    },
    "scene": {
      "en": "A non-inverting amplifier has Rg = 10 kΩ, Rf = 40 kΩ and a model output limit of ±10 V. Input is a 0.5 V DC offset plus a 2 V peak sine.",
      "es": "Un amplificador no inversor tiene Rg = 10 kΩ, Rf = 40 kΩ y límite de salida del modelo ±10 V. La entrada tiene offset de 0,5 V más una senoidal de pico 2 V."
    },
    "steps": [
      {
        "en": "Gain = 1 + 40/10 = 5. Requested output is 2.5 V offset plus 10 V peak.",
        "es": "Ganancia = 1 + 40/10 = 5. La salida solicitada tiene offset 2,5 V más pico 10 V."
      },
      {
        "en": "Requested extremes are +12.5 V and −7.5 V: only the positive side clips. This is a rail-limited model, not a full device specification.",
        "es": "Los extremos solicitados son +12,5 V y −7,5 V: solo recorta arriba. Es un modelo limitado por rieles, no una especificación completa."
      }
    ],
    "question": {
      "en": "Keeping the offset, which input sine peak avoids clipping in this model?",
      "es": "Conservando el offset, ¿qué pico senoidal de entrada evita el recorte en este modelo?"
    },
    "options": [
      {
        "en": "2.5 V",
        "es": "2,5 V"
      },
      {
        "en": "2 V",
        "es": "2 V"
      },
      {
        "en": "1 V",
        "es": "1 V"
      }
    ],
    "correct": 2,
    "why": [
      {
        "en": "It requests +15 V and −10 V; the positive extreme still exceeds the limit.",
        "es": "Solicita +15 V y −10 V; el extremo positivo supera el límite."
      },
      {
        "en": "That is the original clipped input. Include the DC offset in the calculation.",
        "es": "Es la entrada original recortada. Incluye el offset DC en el cálculo."
      },
      {
        "en": "Correct: output spans −2.5 to +7.5 V, both inside the limits.",
        "es": "Correcto: la salida va de −2,5 a +7,5 V, dentro de los límites."
      }
    ]
  },
  "pascal": {
    "title": {
      "en": "Force gain costs travel",
      "es": "Ganar fuerza cuesta recorrido"
    },
    "scene": {
      "en": "An ideal hydraulic press has areas 2 cm² and 20 cm². Input force is 100 N over 50 mm.",
      "es": "Una prensa hidráulica ideal tiene áreas de 2 cm² y 20 cm². La entrada aplica 100 N durante 50 mm."
    },
    "steps": [
      {
        "en": "Area ratio = 10, so output force = 1000 N.",
        "es": "La razón de áreas es 10: fuerza de salida = 1000 N."
      },
      {
        "en": "Equal displaced volume gives output travel = 50/10 = 5 mm. Both sides do 5 J of work.",
        "es": "Igual volumen desplazado da recorrido de salida = 50/10 = 5 mm. Ambos lados realizan 5 J."
      }
    ],
    "question": {
      "en": "Doubling only the output area does what?",
      "es": "¿Qué ocurre al duplicar solo el área de salida?"
    },
    "options": [
      {
        "en": "2000 N over 2.5 mm",
        "es": "2000 N durante 2,5 mm"
      },
      {
        "en": "2000 N over 10 mm",
        "es": "2000 N durante 10 mm"
      },
      {
        "en": "500 N over 10 mm",
        "es": "500 N durante 10 mm"
      }
    ],
    "correct": 0,
    "why": [
      {
        "en": "Correct: twice the force, half the travel, same ideal work.",
        "es": "Correcto: doble fuerza, mitad de recorrido, mismo trabajo ideal."
      },
      {
        "en": "This would multiply work by four without extra input energy.",
        "es": "Esto multiplicaría el trabajo por cuatro sin energía adicional."
      },
      {
        "en": "This corresponds to reducing output area, not increasing it.",
        "es": "Eso corresponde a reducir el área de salida, no aumentarla."
      }
    ]
  },
  "flow": {
    "title": {
      "en": "Predict stroke time",
      "es": "Predecir tiempo de carrera"
    },
    "scene": {
      "en": "A cylinder has a full area of 20 cm², annular area of 12 cm² and 0.3 m stroke. Each direction receives 6 L/min. Ignore leakage.",
      "es": "Un cilindro tiene área completa de 20 cm², anular de 12 cm² y carrera de 0,3 m. Recibe 6 L/min en ambos sentidos. Omite fugas."
    },
    "steps": [
      {
        "en": "6 L/min = 0.0001 m³/s. Extension speed = 0.0001/0.002 = 0.05 m/s: 6 s per stroke.",
        "es": "6 L/min = 0,0001 m³/s. Avance = 0,0001/0,002 = 0,05 m/s: 6 s por carrera."
      },
      {
        "en": "Retraction speed = 0.0001/0.0012 ≈ 0.0833 m/s: 3.6 s per stroke.",
        "es": "Retorno = 0,0001/0,0012 ≈ 0,0833 m/s: 3,6 s por carrera."
      }
    ],
    "question": {
      "en": "What is extension time if useful flow halves?",
      "es": "¿Cuál es el tiempo de avance si el caudal útil se reduce a la mitad?"
    },
    "options": [
      {
        "en": "3 s",
        "es": "3 s"
      },
      {
        "en": "12 s",
        "es": "12 s"
      },
      {
        "en": "6 s",
        "es": "6 s"
      }
    ],
    "correct": 1,
    "why": [
      {
        "en": "Lower flow makes filling slower, not faster.",
        "es": "Menor caudal hace más lento el llenado."
      },
      {
        "en": "Correct: speed halves, so time for the same distance doubles.",
        "es": "Correcto: la velocidad se reduce a la mitad y el tiempo se duplica."
      },
      {
        "en": "Stroke volume is unchanged, but delivery rate has changed.",
        "es": "El volumen de carrera no cambia, pero sí la tasa de suministro."
      }
    ]
  },
  "power": {
    "title": {
      "en": "Track power through a restriction",
      "es": "Seguir potencia en una restricción"
    },
    "scene": {
      "en": "A flow of 12 L/min drops from 80 bar to 50 bar across a valve.",
      "es": "Un caudal de 12 L/min cae de 80 bar a 50 bar a través de una válvula."
    },
    "steps": [
      {
        "en": "Pressure drop = 30 bar. Dissipated power = 30 × 12/600 = 0.6 kW.",
        "es": "Caída = 30 bar. Potencia disipada = 30 × 12/600 = 0,6 kW."
      },
      {
        "en": "Upstream hydraulic power relative to zero gauge is 1.6 kW; downstream is 1.0 kW. The difference heats the system.",
        "es": "Potencia hidráulica aguas arriba respecto a cero manométrico: 1,6 kW; aguas abajo: 1,0 kW. La diferencia calienta el sistema."
      }
    ],
    "question": {
      "en": "With the same drop but 6 L/min, what is the loss?",
      "es": "Con la misma caída pero 6 L/min, ¿cuál es la pérdida?"
    },
    "options": [
      {
        "en": "1.2 kW",
        "es": "1,2 kW"
      },
      {
        "en": "0.6 kW",
        "es": "0,6 kW"
      },
      {
        "en": "0.3 kW",
        "es": "0,3 kW"
      }
    ],
    "correct": 2,
    "why": [
      {
        "en": "Halving flow cannot double ΔpQ at fixed pressure drop.",
        "es": "Reducir caudal a la mitad no duplica ΔpQ con caída fija."
      },
      {
        "en": "This was the loss at twice the flow.",
        "es": "Esa era la pérdida con el doble de caudal."
      },
      {
        "en": "Correct: 30 × 6/600 = 0.3 kW.",
        "es": "Correcto: 30 × 6/600 = 0,3 kW."
      }
    ]
  },
  "relief": {
    "title": {
      "en": "Can the load move?",
      "es": "¿Puede moverse la carga?"
    },
    "scene": {
      "en": "A 10 cm² piston must lift 6000 N. The ideal relief limits supply to 50 bar; ignore return pressure and friction.",
      "es": "Un pistón de 10 cm² debe levantar 6000 N. El alivio ideal limita a 50 bar; omite contrapresión y fricción."
    },
    "steps": [
      {
        "en": "Required pressure = 6000/0.001 = 6 MPa = 60 bar.",
        "es": "Presión necesaria = 6000/0,001 = 6 MPa = 60 bar."
      },
      {
        "en": "Available force is only 5000 N. With the load stationary, pump flow may return through relief.",
        "es": "La fuerza disponible es solo 5000 N. Con la carga inmóvil, el caudal puede volver por alivio."
      }
    ],
    "question": {
      "en": "In the model, reducing the load to 4000 N requires what pressure before motion?",
      "es": "En el modelo, reducir la carga a 4000 N requiere ¿qué presión para moverla?"
    },
    "options": [
      {
        "en": "40 bar",
        "es": "40 bar"
      },
      {
        "en": "50 bar in every condition",
        "es": "50 bar en toda condición"
      },
      {
        "en": "Zero pressure",
        "es": "Presión cero"
      }
    ],
    "correct": 0,
    "why": [
      {
        "en": "Correct: 4000/0.001 = 4 MPa = 40 bar. A relief setting is a limit, not a constant operating pressure.",
        "es": "Correcto: 4000/0,001 = 4 MPa = 40 bar. El ajuste de alivio es un límite, no presión constante."
      },
      {
        "en": "The load sets required pressure below the relief limit in this ideal case.",
        "es": "La carga fija la presión necesaria por debajo del límite en este caso ideal."
      },
      {
        "en": "A nonzero load needs a pressure difference to create force.",
        "es": "Una carga no nula necesita diferencia de presión para producir fuerza."
      }
    ]
  },
  "hydrodiagnosis": {
    "title": {
      "en": "Build a flow balance",
      "es": "Hacer un balance de caudal"
    },
    "scene": {
      "en": "At steady extension a pump delivers 8 L/min, a measured bypass returns 3 L/min, and the cylinder area is 10 cm². Assume no other flow paths.",
      "es": "En avance estable una bomba entrega 8 L/min, un bypass medido retorna 3 L/min y el área del cilindro es 10 cm². Supón que no hay otras rutas."
    },
    "steps": [
      {
        "en": "Useful flow = 8 − 3 = 5 L/min, not 8 L/min.",
        "es": "Caudal útil = 8 − 3 = 5 L/min, no 8 L/min."
      },
      {
        "en": "Speed = (5/60000)/0.001 ≈ 0.0833 m/s. Pressure alone would not reveal this flow split.",
        "es": "Velocidad = (5/60000)/0,001 ≈ 0,0833 m/s. La presión sola no revela esta división."
      }
    ],
    "question": {
      "en": "What evidence best verifies that the bypass repair restored delivery?",
      "es": "¿Qué evidencia verifica mejor que reparar el bypass recuperó el suministro?"
    },
    "options": [
      {
        "en": "The paint looks new",
        "es": "La pintura parece nueva"
      },
      {
        "en": "Repeat branch flow and stroke-time measurements at the same load",
        "es": "Repetir caudal de ramas y tiempo de carrera con la misma carga"
      },
      {
        "en": "Only check unloaded pressure",
        "es": "Comprobar solo presión sin carga"
      }
    ],
    "correct": 1,
    "why": [
      {
        "en": "Appearance does not quantify the causal flow path.",
        "es": "La apariencia no cuantifica la ruta de caudal causal."
      },
      {
        "en": "Correct: this checks both the suspected cause and its effect under comparable conditions.",
        "es": "Correcto: comprueba la causa sospechada y su efecto en condiciones comparables."
      },
      {
        "en": "A different load can hide the loss and does not verify delivered flow.",
        "es": "Otra carga puede ocultar la pérdida y no verifica el caudal entregado."
      }
    ]
  },
  "air": {
    "title": {
      "en": "Use absolute pressure",
      "es": "Usar presión absoluta"
    },
    "scene": {
      "en": "A sealed 2 L air volume starts at 3 bar gauge with atmosphere at 1 bar. It compresses slowly to 1 L at constant temperature.",
      "es": "Un volumen sellado de aire de 2 L empieza a 3 bar manométricos con atmósfera a 1 bar. Se comprime lentamente a 1 L a temperatura constante."
    },
    "steps": [
      {
        "en": "Initial absolute pressure = 3 + 1 = 4 bar.",
        "es": "Presión absoluta inicial = 3 + 1 = 4 bar."
      },
      {
        "en": "Boyle: final absolute pressure = 4 × 2/1 = 8 bar, or 7 bar gauge.",
        "es": "Boyle: presión absoluta final = 4 × 2/1 = 8 bar, o 7 bar manométricos."
      }
    ],
    "question": {
      "en": "If it instead expands to 4 L under the same assumptions, what is final gauge pressure?",
      "es": "Si se expande a 4 L con los mismos supuestos, ¿cuál es la presión manométrica final?"
    },
    "options": [
      {
        "en": "2 bar",
        "es": "2 bar"
      },
      {
        "en": "1.5 bar",
        "es": "1,5 bar"
      },
      {
        "en": "1 bar",
        "es": "1 bar"
      }
    ],
    "correct": 2,
    "why": [
      {
        "en": "2 bar is absolute; subtract the 1 bar atmosphere.",
        "es": "2 bar es absoluta; resta 1 bar de atmósfera."
      },
      {
        "en": "This halves the gauge reading directly, which Boyle does not permit.",
        "es": "Esto divide directamente la lectura manométrica, algo que Boyle no permite."
      },
      {
        "en": "Correct: 4 × 2/4 = 2 bar absolute, then subtract 1 bar.",
        "es": "Correcto: 4 × 2/4 = 2 bar absolutos; después resta 1 bar."
      }
    ]
  },
  "airchain": {
    "title": {
      "en": "Find a dynamic restriction",
      "es": "Encontrar una restricción dinámica"
    },
    "scene": {
      "en": "At rest both sides of a filter read 6 bar. During actuator demand the inlet is 5.8 bar and outlet 3.0 bar.",
      "es": "En reposo ambos lados de un filtro marcan 6 bar. Durante demanda, la entrada marca 5,8 bar y la salida 3,0 bar."
    },
    "steps": [
      {
        "en": "The filter section loses 2.8 bar during flow, but almost nothing at rest.",
        "es": "El tramo del filtro pierde 2,8 bar con flujo, pero casi nada en reposo."
      },
      {
        "en": "This localises a restriction to the measured section; compare flow and component specifications before identifying a particular damaged part.",
        "es": "Esto localiza una restricción en el tramo medido; compara caudal y especificaciones antes de identificar una pieza dañada."
      }
    ],
    "question": {
      "en": "Which next comparison is most informative?",
      "es": "¿Qué comparación siguiente informa más?"
    },
    "options": [
      {
        "en": "Repeat inlet/outlet readings under the same demand after inspecting that section",
        "es": "Repetir lecturas de entrada/salida con igual demanda tras revisar el tramo"
      },
      {
        "en": "Increase pressure until the symptom disappears",
        "es": "Subir presión hasta que desaparezca el síntoma"
      },
      {
        "en": "Use only the resting outlet reading",
        "es": "Usar solo la lectura de salida en reposo"
      }
    ],
    "correct": 0,
    "why": [
      {
        "en": "Correct: it tests the suspected restriction under the condition that exposed it.",
        "es": "Correcto: prueba la restricción sospechada bajo la condición que la reveló."
      },
      {
        "en": "Changing supply can mask the symptom without locating or correcting the restriction.",
        "es": "Cambiar el suministro puede ocultar el síntoma sin localizar ni corregir la restricción."
      },
      {
        "en": "The resting reading already failed to show the dynamic drop.",
        "es": "La lectura en reposo ya ocultaba la caída dinámica."
      }
    ]
  },
  "valve52": {
    "title": {
      "en": "Trace both sides of the piston",
      "es": "Seguir ambos lados del pistón"
    },
    "scene": {
      "en": "In this labelled example, P supplies A while B connects to exhaust. A feeds the full piston face.",
      "es": "En este ejemplo etiquetado, P alimenta A mientras B conecta al escape. A alimenta la cara completa del pistón."
    },
    "steps": [
      {
        "en": "Pressure on A tends to extend the rod, provided air in B can escape and force exceeds load.",
        "es": "La presión en A tiende a extender el vástago si B puede descargar y la fuerza supera la carga."
      },
      {
        "en": "Switching connects P to B and A to exhaust. Check the actual symbol: port labels alone do not identify spool state.",
        "es": "Al conmutar, P conecta a B y A al escape. Revisa el símbolo real: las etiquetas solas no indican posición."
      }
    ],
    "question": {
      "en": "If B exhaust is blocked during extension, what can happen?",
      "es": "Si se bloquea el escape B durante el avance, ¿qué puede ocurrir?"
    },
    "options": [
      {
        "en": "The piston must move faster",
        "es": "El pistón necesariamente va más rápido"
      },
      {
        "en": "Trapped-air back pressure can oppose extension",
        "es": "La contrapresión del aire atrapado puede oponerse al avance"
      },
      {
        "en": "Supply pressure becomes irrelevant",
        "es": "La presión de suministro deja de importar"
      }
    ],
    "correct": 1,
    "why": [
      {
        "en": "Blocked exhaust impedes displacement of air; it does not guarantee faster motion.",
        "es": "El escape bloqueado impide desplazar aire; no garantiza más velocidad."
      },
      {
        "en": "Correct: consider both chamber pressures, not just the supply connection.",
        "es": "Correcto: considera ambas presiones, no solo la conexión de suministro."
      },
      {
        "en": "Net force still depends on chamber pressures and effective areas.",
        "es": "La fuerza neta aún depende de presiones y áreas efectivas."
      }
    ]
  },
  "cylinderforce": {
    "title": {
      "en": "Include back pressure",
      "es": "Incluir contrapresión"
    },
    "scene": {
      "en": "A cylinder has full area 10 cm² and annular area 6 cm². Extension uses 5 bar gauge on the full side and 2 bar on the rod side.",
      "es": "Un cilindro tiene área completa de 10 cm² y anular de 6 cm². Al avanzar hay 5 bar manométricos en la cara completa y 2 bar en la del vástago."
    },
    "steps": [
      {
        "en": "Use 1 bar·cm² = 10 N. Forward pressure force = 5 × 10 × 10 = 500 N.",
        "es": "Usa 1 bar·cm² = 10 N. Fuerza hacia delante = 5 × 10 × 10 = 500 N."
      },
      {
        "en": "Opposing pressure force = 2 × 6 × 10 = 120 N. Net before friction is 380 N.",
        "es": "Fuerza opuesta = 2 × 6 × 10 = 120 N. La neta antes de fricción es 380 N."
      }
    ],
    "question": {
      "en": "With 30 N friction, can it overcome a 400 N opposing load from rest?",
      "es": "Con fricción de 30 N, ¿puede vencer una carga opuesta de 400 N desde reposo?"
    },
    "options": [
      {
        "en": "Yes, because supply gives 500 N",
        "es": "Sí, porque el suministro da 500 N"
      },
      {
        "en": "Yes, because the rod side has less area",
        "es": "Sí, porque el lado del vástago tiene menos área"
      },
      {
        "en": "No: only 350 N remains for the load",
        "es": "No: solo quedan 350 N para la carga"
      }
    ],
    "correct": 2,
    "why": [
      {
        "en": "This ignores both back pressure and friction.",
        "es": "Esto ignora contrapresión y fricción."
      },
      {
        "en": "Smaller rod-side area reduces the opposing force but does not remove it.",
        "es": "El área menor reduce la fuerza opuesta, pero no la elimina."
      },
      {
        "en": "Correct: 500 − 120 − 30 = 350 N, less than the load.",
        "es": "Correcto: 500 − 120 − 30 = 350 N, menor que la carga."
      }
    ]
  },
  "pneudiagnosis": {
    "title": {
      "en": "Command is not confirmation",
      "es": "Orden no es confirmación"
    },
    "scene": {
      "en": "The PLC commands extension. The rod reaches the end visually, but its end-position input stays off. Other inputs operate normally.",
      "es": "El PLC ordena avance. El vástago llega visualmente al final, pero su entrada de posición sigue apagada. Otras entradas funcionan."
    },
    "steps": [
      {
        "en": "Motion evidence makes total loss of air supply less likely for this event. It does not prove every pneumatic condition is correct.",
        "es": "El movimiento hace menos probable la pérdida total de aire en este evento. No demuestra que toda la neumática esté bien."
      },
      {
        "en": "Distinguish sensor detection, sensor output and PLC input. A missing input can come from alignment, supply, wiring or the input channel.",
        "es": "Distingue detección, salida del sensor y entrada PLC. La señal ausente puede deberse a alineación, alimentación, cableado o canal."
      }
    ],
    "question": {
      "en": "Which simulated test best separates sensor output from a wiring/input issue?",
      "es": "¿Qué prueba simulada distingue mejor salida del sensor y problema de cableado/entrada?"
    },
    "options": [
      {
        "en": "Compare sensor output and PLC input for the same confirmed piston position",
        "es": "Comparar salida del sensor y entrada PLC con la misma posición confirmada"
      },
      {
        "en": "Replace the cylinder immediately",
        "es": "Reemplazar el cilindro inmediatamente"
      },
      {
        "en": "Increase the timer indefinitely",
        "es": "Aumentar el temporizador indefinidamente"
      }
    ],
    "correct": 0,
    "why": [
      {
        "en": "Correct: signal present at the sensor but absent at the PLC narrows the fault to the path between them or input interpretation.",
        "es": "Correcto: señal presente en sensor y ausente en PLC reduce la búsqueda al trayecto o interpretación de entrada."
      },
      {
        "en": "The rod already moves; replacing it does not test the missing signal.",
        "es": "El vástago ya se mueve; reemplazarlo no prueba la señal ausente."
      },
      {
        "en": "More time does not restore a missing electrical signal and can conceal the fault.",
        "es": "Más tiempo no restaura una señal ausente y puede ocultar el fallo."
      }
    ]
  }
};
