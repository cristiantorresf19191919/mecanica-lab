export const modules = [
  {
    "id": 1,
    "title": "Anatomía y funcionamiento de la bicicleta",
    "lessons": [
      {
        "id": "1.1",
        "title": "Historia y evolución de las bicicletas",
        "theory": "La bicicleta pasó del impulso con los pies a los pedales, la cadena y las ruedas de tamaño semejante. Cada cambio resolvió un problema: propulsión, control o comodidad. Una tecnología más nueva no implica compatibilidad con la anterior.",
        "steps": [
          "Compara una bicicleta antigua con la tuya",
          "Localiza qué piezas permiten avanzar, dirigir y detenerse",
          "Anota una mejora funcional de cada sistema."
        ],
        "diagnosis": "Una pieza antigua puede parecer equivalente y usar otra rosca: identifica antes de sustituir.",
        "question": "¿Qué permitió separar pedaleo y rueda motriz?",
        "answers": [
          "La transmisión por cadena",
          "La pintura del cuadro",
          "La válvula de aire"
        ],
        "correct": 0
      },
      {
        "id": "1.2",
        "title": "Tipos de bicicletas: MTB, ruta, urbana, gravel y eléctrica",
        "theory": "MTB prioriza terreno irregular; ruta, rodadura eficiente; urbana, uso cotidiano; gravel, superficies mixtas. La eléctrica añade asistencia. Neumáticos, geometría y componentes definen el uso más que la etiqueta comercial.",
        "steps": [
          "Identifica terreno y uso de tu cicla",
          "Registra tamaño de rueda, frenos y transmisión",
          "Relaciona dos componentes con ese uso."
        ],
        "diagnosis": "No diagnostiques una cubierta ancha como lenta por sí sola: presión, carcasa y terreno también influyen.",
        "question": "¿Qué dato orienta la elección de bicicleta?",
        "answers": [
          "El uso y el terreno",
          "Solo el color",
          "Solo el número de cambios"
        ],
        "correct": 0
      },
      {
        "id": "1.3",
        "title": "Anatomía: cuadro, dirección, ruedas, transmisión y frenos",
        "theory": "El cuadro conecta los apoyos; la dirección permite orientar la rueda delantera; los rodamientos reducen resistencia; la transmisión entrega torque a la rueda trasera. Los frenos disipan energía en forma de calor.",
        "steps": [
          "Señala cuadro, horquilla, bujes, platos, cassette y frenos en el 3D",
          "Encuentra las mismas piezas en una bicicleta",
          "Distingue piezas fijas de giratorias."
        ],
        "diagnosis": "Si una rueda roza, separa contacto del freno, desalineación de rueda y problema de rodamiento.",
        "question": "¿Qué componente permite girar con poca fricción?",
        "answers": [
          "El rodamiento",
          "El sillín",
          "La funda del cable"
        ],
        "correct": 0
      },
      {
        "id": "1.4",
        "title": "Cómo se transmite la fuerza desde los pedales hasta la rueda",
        "theory": "La fuerza sobre el pedal produce torque en la biela. El plato tira de la cadena y el piñón entrega torque al buje. En rueda libre, puedes dejar de pedalear mientras la rueda sigue girando.",
        "steps": [
          "Cambia el piñón en el banco",
          "Compara vueltas de biela y de rueda",
          "Describe el recorrido de la fuerza sin tocar una cadena en movimiento."
        ],
        "diagnosis": "Si los pedales giran sin arrastrar la rueda, revisa cadena y mecanismo de rueda libre antes de culpar al cambio.",
        "question": "¿Con plato de 32 y piñón de 16, cuántas vueltas da la rueda por vuelta de biela?",
        "answers": [
          "2",
          "0,5",
          "16"
        ],
        "correct": 0
      },
      {
        "id": "1.5",
        "title": "Principios físicos: fricción, torque, palancas y engranajes",
        "theory": "Torque es fuerza por brazo perpendicular: τ=F·r. Una biela más larga aumenta ese brazo. La fricción permite tracción y frenado, pero también produce pérdidas. Los engranajes intercambian velocidad por torque; no crean energía.",
        "steps": [
          "Compara una fuerza de 100 N con brazos de 0,17 y 0,10 m",
          "Calcula ambos torques",
          "Relaciona un piñón grande con subir una pendiente."
        ],
        "diagnosis": "Distingue patinaje del neumático de salto de cadena: el lugar donde se pierde movimiento cambia el diagnóstico.",
        "question": "¿Qué torque dan 100 N a 0,17 m perpendicularmente?",
        "answers": [
          "17 N·m",
          "170 N·m",
          "0,17 N·m"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 2,
    "title": "Herramientas del mecánico",
    "lessons": [
      {
        "id": "2.1",
        "title": "Llaves Allen, Torx, fijas y ajustables",
        "theory": "Allen actúa sobre hexágonos interiores; Torx sobre perfiles de seis lóbulos; una llave fija abraza caras externas. El tamaño correcto reparte el esfuerzo y evita redondear la cabeza.",
        "steps": [
          "Limpia el alojamiento",
          "Prueba la llave sin aplicar fuerza y comprueba que entra completamente",
          "Mantén alineada la herramienta al girar."
        ],
        "diagnosis": "Si hay juego entre llave y tornillo, detente: herramienta incorrecta o cabeza dañada.",
        "question": "¿Qué haces antes de aflojar una cabeza con suciedad?",
        "answers": [
          "Limpiar y comprobar el encaje",
          "Golpear cualquier llave",
          "Usar siempre una talla menor"
        ],
        "correct": 0
      },
      {
        "id": "2.2",
        "title": "Tronchacadenas, alicates para eslabón rápido y extractores",
        "theory": "El tronchacadenas empuja pasadores; el alicate de eslabón rápido actúa sobre el cierre; los extractores encajan en interfaces específicas. Una herramienta parecida puede dañar la pieza si no corresponde.",
        "steps": [
          "Identifica el tipo de unión de tu cadena",
          "Busca el extractor exacto en el manual",
          "Comprueba apoyo y alineación sin aplicar carga."
        ],
        "diagnosis": "Un extractor que apenas engancha puede arrancar roscas: no lo fuerces para compensar incompatibilidad.",
        "question": "¿Qué determina el extractor correcto?",
        "answers": [
          "La interfaz y el modelo",
          "El color de la pieza",
          "La longitud del mango"
        ],
        "correct": 0
      },
      {
        "id": "2.3",
        "title": "Llaves dinamométricas y pares de apriete",
        "theory": "El par de apriete es un momento de fuerza, no una medida directa de tensión del tornillo. Lubricación, rosca y apoyo cambian la precarga obtenida. El valor y el estado de montaje deben venir del fabricante.",
        "steps": [
          "Localiza el par y la secuencia del componente",
          "Elige una dinamométrica dentro de su rango",
          "Aprieta progresivamente siguiendo el manual y registra el valor."
        ],
        "diagnosis": "Apretar más no corrige una pieza incompatible ni una rosca dañada; puede romperla.",
        "question": "¿De dónde sale el par de apriete?",
        "answers": [
          "Del manual del componente",
          "De un valor único para toda la bici",
          "De apretar hasta que no gire"
        ],
        "correct": 0
      },
      {
        "id": "2.4",
        "title": "Lubricantes, grasas, desengrasantes y limpiadores",
        "theory": "Aceite lubrica articulaciones; grasa permanece en ciertos apoyos; pasta de montaje cumple otra función. El producto debe ser compatible con sellos y materiales. Los frenos necesitan superficies libres de lubricantes.",
        "steps": [
          "Identifica el producto previsto para cada zona",
          "Protege discos y pastillas antes de limpiar la transmisión",
          "Aplica poca cantidad y retira excedentes."
        ],
        "diagnosis": "Si contaminas una pastilla, sigue el criterio de sustitución del fabricante: no asumas que quemarla la recupera.",
        "question": "¿Dónde NO aplicas lubricante de cadena?",
        "answers": [
          "Sobre el disco de freno",
          "En articulaciones de cadena según producto",
          "En el aplicador"
        ],
        "correct": 0
      },
      {
        "id": "2.5",
        "title": "Cómo organizar un taller y trabajar con seguridad",
        "theory": "Un taller ordenado reduce errores de montaje. Separar piezas por conjuntos permite reconstruir su posición. Sujetar una bici requiere un punto autorizado: aplastar un tubo fino o de carbono puede dañarlo.",
        "steps": [
          "Prepara soporte estable y buena luz",
          "Ordena herramientas y bandejas",
          "Protege ojos y manos según la operación y separa químicos de frenos."
        ],
        "diagnosis": "Una pieza sobrante al terminar es una señal para revisar el montaje, no para descartarla.",
        "question": "¿Qué ayuda a reconstruir un conjunto?",
        "answers": [
          "Registrar el orden de desmontaje",
          "Mezclar todas las arandelas",
          "Descartar separadores"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 3,
    "title": "Mantenimiento preventivo",
    "lessons": [
      {
        "id": "3.1",
        "title": "Inspección completa antes de montar",
        "theory": "La revisión previa busca problemas que impedirían frenar, dirigir o mantener las ruedas sujetas. Es una inspección funcional, no solo estética: presión, fijaciones, holguras y respuesta de ambos frenos.",
        "steps": [
          "Comprueba ruedas y cubiertas",
          "Acciona cada freno y revisa dirección",
          "Haz una prueba a baja velocidad solo después de superar la revisión estática."
        ],
        "diagnosis": "Si la maneta llega al manubrio sin frenar, no salgas a probar en tráfico: identifica y corrige la causa.",
        "question": "¿Qué defecto impide salir a rodar?",
        "answers": [
          "Un freno sin capacidad de detener",
          "Un adhesivo desgastado",
          "Polvo en el portabidón"
        ],
        "correct": 0
      },
      {
        "id": "3.2",
        "title": "Limpieza de la bicicleta sin dañar componentes",
        "theory": "Agua a presión puede introducir suciedad en sellos y rodamientos. Una limpieza suave permite ver grietas, fugas y desgaste que el barro oculta. Limpiar no sustituye lubricar después donde corresponde.",
        "steps": [
          "Retira suciedad con cepillo suave y producto compatible",
          "Evita chorros directos a sellos y electrónica",
          "Seca e inspecciona antes de lubricar la cadena."
        ],
        "diagnosis": "Un rodamiento áspero tras lavar puede haber recibido agua: no lo ocultes con más lubricante externo.",
        "question": "¿Cómo limpias cerca de rodamientos?",
        "answers": [
          "Sin chorro de alta presión",
          "Apuntando la hidrolavadora al sello",
          "Sumergiendo toda la bici eléctrica"
        ],
        "correct": 0
      },
      {
        "id": "3.3",
        "title": "Identificación de piezas desgastadas",
        "theory": "El desgaste se comprueba con medidas y límites específicos: cadena, espesor de pastilla y rotor, dibujo y carcasa. Una pieza puede funcionar en vacío y fallar bajo carga.",
        "steps": [
          "Elige un componente",
          "Mide con la herramienta apropiada",
          "Compara con el límite publicado y registra la lectura."
        ],
        "diagnosis": "Cambiar solo la cadena puede revelar un cassette desgastado: un salto bajo carga exige revisar el conjunto.",
        "question": "¿Qué confirma que una pieza excede su desgaste permitido?",
        "answers": [
          "Una medida comparada con su límite",
          "Que todavía gire en el soporte",
          "Que sea de una marca conocida"
        ],
        "correct": 0
      },
      {
        "id": "3.4",
        "title": "Lubricación correcta de componentes",
        "theory": "La cadena necesita lubricación en sus articulaciones, no una capa pegajosa exterior. El exceso retiene abrasivos. Los rodamientos sellados y los cables no comparten necesariamente el mismo procedimiento.",
        "steps": [
          "Limpia y seca la cadena",
          "Aplica el lubricante según sus instrucciones y deja penetrar",
          "Retira el sobrante exterior antes de usar."
        ],
        "diagnosis": "Una cadena negra y pastosa puede contener abrasivo aunque parezca bien engrasada.",
        "question": "¿Dónde interesa que penetre el lubricante?",
        "answers": [
          "En las articulaciones",
          "Solo sobre las placas exteriores",
          "En las pastillas de freno"
        ],
        "correct": 0
      },
      {
        "id": "3.5",
        "title": "Calendario de mantenimiento por kilómetros y uso",
        "theory": "Kilómetros, horas, lluvia, polvo y carga afectan los intervalos. El calendario combina recomendaciones del fabricante con inspección por condición. No existe un intervalo universal válido para toda bicicleta.",
        "steps": [
          "Crea un registro de fecha, uso y condiciones",
          "Anota medidas de cadena, frenos y presión",
          "Programa revisiones con los intervalos del modelo y adelántalas tras uso severo."
        ],
        "diagnosis": "Un ruido nuevo o una fuga exige inspección aunque todavía no venza el calendario.",
        "question": "¿Qué justifica adelantar una revisión?",
        "answers": [
          "Lluvia, barro o síntomas nuevos",
          "Que el calendario sea decorativo",
          "Solo cambiar de ruta"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 4,
    "title": "La cadena y el sistema de transmisión",
    "lessons": [
      {
        "id": "4.1",
        "title": "Anatomía de la cadena: placas, rodillos y pasadores",
        "theory": "Placas, pasadores y rodillos forman articulaciones repetidas. La cadena engrana con los dientes mediante los rodillos. El desgaste de articulaciones aumenta el paso efectivo acumulado; no es simplemente que las placas se estiren.",
        "steps": [
          "Observa una cadena quieta con lupa",
          "Distingue eslabón interior y exterior",
          "Articula varios puntos y localiza rigidez."
        ],
        "diagnosis": "Un eslabón rígido salta al pasar por una roldana aunque la indexación esté bien.",
        "question": "¿Qué parte se apoya contra los dientes?",
        "answers": [
          "El rodillo",
          "La funda del cable",
          "La cabecilla del radio"
        ],
        "correct": 0
      },
      {
        "id": "4.2",
        "title": "Cómo retirar una cadena con tronchacadenas",
        "theory": "El tronchacadenas necesita apoyar el eslabón y alinear su punzón con el pasador. No todas las cadenas permiten reutilizar el pasador extraído. Planifica la unión compatible antes de abrir.",
        "steps": [
          "Identifica cadena y método autorizado de cierre",
          "Descarga la tensión y apoya el eslabón en la herramienta",
          "Extrae según el manual conservando la longitud necesaria."
        ],
        "diagnosis": "Un punzón descentrado puede deformar una placa: no continúes sobre una unión dañada.",
        "question": "¿Qué debes decidir antes de abrir la cadena?",
        "answers": [
          "Cómo volverás a unirla de forma compatible",
          "Qué pintura usarás",
          "Cómo doblar el pasador"
        ],
        "correct": 0
      },
      {
        "id": "4.3",
        "title": "Cómo instalar un pin de unión correctamente",
        "theory": "Un pin de unión solo se utiliza cuando ese modelo de cadena lo admite. Algunos tienen guía desprendible y condiciones de montaje específicas. Un pasador cualquiera no sustituye al repuesto indicado.",
        "steps": [
          "Consulta el manual de la cadena",
          "Prepara el pin y herramienta compatibles",
          "Monta según su orientación y comprueba articulación y posición final."
        ],
        "diagnosis": "Una placa deformada o un pin fuera de posición requiere rehacer la unión con piezas admitidas, no confiar en que se asiente rodando.",
        "question": "¿Puedes usar cualquier pin del mismo aspecto?",
        "answers": [
          "No, debe ser compatible y autorizado",
          "Sí, si entra a golpes",
          "Sí, si se recorta"
        ],
        "correct": 0
      },
      {
        "id": "4.4",
        "title": "Eslabones rápidos (Quick Link): instalación y compatibilidad",
        "theory": "Los eslabones rápidos dependen de familia de cadena, ancho y diseño; algunos tienen sentido y uso único. El cierre debe quedar completamente asentado, con ambas placas correctamente enlazadas.",
        "steps": [
          "Verifica referencia y sentido",
          "Acopla ambas mitades en los extremos correctos",
          "Asienta con el método indicado y revisa visualmente y al articular."
        ],
        "diagnosis": "Un clic no garantiza cierre si las placas quedaron torcidas: inspecciona ambos lados.",
        "question": "¿Qué verificas en un Quick Link?",
        "answers": [
          "Compatibilidad, sentido y reutilización permitida",
          "Solo que tenga dos agujeros",
          "Solo su color"
        ],
        "correct": 0
      },
      {
        "id": "4.5",
        "title": "Cómo calcular la longitud de la cadena",
        "theory": "Una cadena corta sobrecarga el cambio en combinaciones grandes; una larga puede perder tensión. El método de longitud cambia con transmisión y suspensión: no copies una fórmula de otro sistema.",
        "steps": [
          "Identifica transmisión y recorrido de suspensión",
          "Aplica el método de longitud del fabricante",
          "Comprueba combinaciones extremas y capacidad sin forzar."
        ],
        "diagnosis": "Si el cambio queda totalmente estirado, detén la prueba y revisa longitud y compatibilidad.",
        "question": "¿Qué riesgo tiene una cadena demasiado corta?",
        "answers": [
          "Sobrecargar el cambio",
          "Aumentar automáticamente la potencia",
          "Reducir siempre el desgaste"
        ],
        "correct": 0
      },
      {
        "id": "4.6",
        "title": "Diagnóstico de ruidos, saltos y desgaste",
        "theory": "Saltos pueden venir de desgaste, eslabón rígido, mala unión, indexación o dientes dañados. Cambia una variable por vez y distingue salto de cadena de fallo del núcleo de rueda libre.",
        "steps": [
          "Marca cuándo ocurre el salto",
          "Mide desgaste y articula la cadena",
          "Revisa unión y dientes antes de ajustar el cable."
        ],
        "diagnosis": "Un salto solo bajo carga después de poner cadena nueva sugiere revisar el engrane con el cassette.",
        "question": "¿Qué haces primero ante un salto?",
        "answers": [
          "Localizar cuándo y dónde ocurre",
          "Girar todos los tornillos",
          "Cambiar todas las piezas"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 5,
    "title": "Frenos de zapata y sistemas mecánicos",
    "lessons": [
      {
        "id": "5.1",
        "title": "Principios físicos del frenado",
        "theory": "El freno aplica fuerza tangencial y un momento que reduce la velocidad de la rueda. La energía cinética se convierte principalmente en calor. La adherencia del neumático limita la fuerza útil sobre el suelo.",
        "steps": [
          "Identifica la superficie de frenado",
          "Compara una rueda libre y una frenada en soporte",
          "Explica por qué una rueda bloqueada no garantiza control."
        ],
        "diagnosis": "Si la rueda se bloquea pero resbala, el límite puede ser adherencia, no fuerza del freno.",
        "question": "¿En qué se transforma gran parte de la energía al frenar?",
        "answers": [
          "Calor",
          "Combustible",
          "Presión del neumático"
        ],
        "correct": 0
      },
      {
        "id": "5.2",
        "title": "Tipos: V-Brake, cantilever y caliper",
        "theory": "V-Brake, cantilever y caliper tienen geometrías y relaciones de palanca distintas. La maneta debe proporcionar el tiro de cable previsto. Mezclar tiros incompatibles altera recorrido y fuerza.",
        "steps": [
          "Identifica el tipo de freno",
          "Busca el tiro compatible de maneta",
          "Observa pivotes y trayectoria de las zapatas."
        ],
        "diagnosis": "Una maneta con mucho recorrido puede ser incompatible aunque el cable esté tenso.",
        "question": "¿Qué debe ser compatible entre maneta y freno?",
        "answers": [
          "El tiro de cable",
          "El color de la goma",
          "La longitud del manubrio únicamente"
        ],
        "correct": 0
      },
      {
        "id": "5.3",
        "title": "Cómo funcionan las guayas, fundas y resortes",
        "theory": "El cable interior transmite tracción; la funda ofrece la reacción que permite actuar a distancia; los resortes devuelven el mecanismo. Fricción o funda mal asentada produce respuesta irregular.",
        "steps": [
          "Inspecciona extremos y recorrido de funda",
          "Acciona la maneta lentamente",
          "Comprueba que cada brazo regresa libremente."
        ],
        "diagnosis": "Si no retorna, separa fricción del cable y pivotes antes de aumentar el resorte.",
        "question": "¿Para qué sirve la funda?",
        "answers": [
          "Dar apoyo a la transmisión por cable",
          "Transportar aceite en todos los frenos",
          "Frenar directamente la rueda"
        ],
        "correct": 0
      },
      {
        "id": "5.4",
        "title": "Ajuste de tensión, centrado y separación",
        "theory": "Centrar equilibra la separación a ambos lados; tensar modifica holgura inicial. No uses tensión de cable para compensar una rueda mal asentada. Las zapatas deben tocar la pista, no la cubierta.",
        "steps": [
          "Asienta la rueda correctamente",
          "Alinea zapatas en la pista y centra brazos según modelo",
          "Ajusta holgura y verifica recorrido de maneta."
        ],
        "diagnosis": "Un roce periódico puede venir del rin descentrado, no de tensión desigual.",
        "question": "¿Qué compruebas antes de centrar el freno?",
        "answers": [
          "Que la rueda esté bien asentada",
          "El color del sillín",
          "Que el cable esté al máximo"
        ],
        "correct": 0
      },
      {
        "id": "5.5",
        "title": "Sustitución de zapatas y cables",
        "theory": "Las zapatas tienen orientación y límites de desgaste. El cable debe pasar por su anclaje previsto, con funda en buen estado y terminales correctos. Un mal anclaje puede deslizarse al frenar.",
        "steps": [
          "Registra arandelas y orientación",
          "Instala repuestos compatibles al par indicado",
          "Acciona con firmeza y comprueba que el cable no se desliza."
        ],
        "diagnosis": "Una zapata que toca la cubierta puede dañarla: corrige la posición antes de rodar.",
        "question": "¿Dónde debe apoyar la zapata?",
        "answers": [
          "En la pista de frenado",
          "Sobre el neumático",
          "En los radios"
        ],
        "correct": 0
      },
      {
        "id": "5.6",
        "title": "Diagnóstico de frenos flojos, bloqueados o ruidosos",
        "theory": "Freno flojo puede significar exceso de holgura, cable deslizante o superficie contaminada. Bloqueo puede ser cable o pivote atascado. Ruido no identifica por sí solo una causa.",
        "steps": [
          "Separa recorrido de maneta y fuerza real",
          "Inspecciona cable, pivotes y superficie",
          "Prueba cada corrección por separado."
        ],
        "diagnosis": "Si la maneta se siente firme pero no frena, revisa contacto y contaminación antes de tensar más.",
        "question": "¿Una maneta firme garantiza buen frenado?",
        "answers": [
          "No, hay que comprobar fuerza y contacto",
          "Sí, siempre",
          "Solo si la bici es nueva"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 6,
    "title": "Frenos de disco mecánicos e hidráulicos",
    "lessons": [
      {
        "id": "6.1",
        "title": "Rotor, cáliper, pistones y pastillas",
        "theory": "El rotor gira con la rueda. Las pastillas lo aprietan desde el cáliper; los pistones o el mecanismo mecánico producen ese desplazamiento. Calor y desgaste afectan a rotor y material de fricción.",
        "steps": [
          "Localiza rotor, cáliper, pastillas y fijaciones",
          "Observa el espacio de paso con la rueda quieta",
          "Distingue una fuga de una marca de suciedad."
        ],
        "diagnosis": "No pongas los dedos cerca del rotor en movimiento ni lo toques caliente.",
        "question": "¿Qué pieza gira con la rueda?",
        "answers": [
          "El rotor",
          "El cáliper fijado a la horquilla",
          "La maneta"
        ],
        "correct": 0
      },
      {
        "id": "6.2",
        "title": "Diferencias entre frenos mecánicos e hidráulicos",
        "theory": "En un freno mecánico la guaya mueve el mecanismo; en uno hidráulico la presión transmite fuerza a pistones. Los diseños de uno o dos lados móviles requieren ajustes distintos.",
        "steps": [
          "Sigue la conexión desde la maneta",
          "Identifica cable o manguera",
          "Consulta cómo se ajusta la separación en ese cáliper."
        ],
        "diagnosis": "Una maneta esponjosa hidráulica y un cable estirado no se corrigen con el mismo procedimiento.",
        "question": "¿Qué transmite la fuerza en un sistema hidráulico?",
        "answers": [
          "Presión del fluido",
          "Una cadena",
          "El aire de la cubierta"
        ],
        "correct": 0
      },
      {
        "id": "6.3",
        "title": "Cómo centrar un cáliper",
        "theory": "El centrado busca que el rotor pase libre y las pastillas trabajen correctamente. La técnica depende del cáliper y del número de pastillas móviles. Antes hay que asentar rueda y revisar rotor.",
        "steps": [
          "Comprueba fijación de rueda y rectitud del rotor",
          "Sigue la secuencia de alineación del fabricante",
          "Aprieta al par y verifica al girar y al frenar."
        ],
        "diagnosis": "Si roza en un solo punto por vuelta, investiga desviación del rotor antes de mover todo el cáliper.",
        "question": "¿Qué sugiere un roce localizado una vez por vuelta?",
        "answers": [
          "Desviación localizada del rotor",
          "Siempre aire en el líquido",
          "Siempre cadena larga"
        ],
        "correct": 0
      },
      {
        "id": "6.4",
        "title": "Cómo eliminar rozamientos y chirridos",
        "theory": "Roce continuo, roce periódico y chirrido al frenar son síntomas diferentes. Suciedad, contaminación, desalineación o vibración pueden coincidir. No apliques aceite para silenciar un freno.",
        "steps": [
          "Describe cuándo aparece el ruido",
          "Inspecciona rotor, pastillas y fijaciones",
          "Corrige una causa y repite la prueba controlada."
        ],
        "diagnosis": "Un disco aceitado puede perder frenado aunque deje de sonar; sigue el procedimiento de descontaminación y sustitución indicado.",
        "question": "¿Cómo tratas un disco que chirría?",
        "answers": [
          "Diagnosticar contacto, contaminación y fijaciones",
          "Lubricarlo",
          "Aflojarlo para que no vibre"
        ],
        "correct": 0
      },
      {
        "id": "6.5",
        "title": "Sustitución de pastillas y rotores",
        "theory": "Rotor y pastillas tienen espesores mínimos específicos. El material de pastilla debe ser compatible con rotor y sistema. Retirar rueda o pastillas puede requerir separador para evitar salida excesiva de pistones.",
        "steps": [
          "Mide contra el límite del fabricante",
          "Instala componentes y seguros correctos",
          "Revisa fijaciones y realiza el asentamiento indicado."
        ],
        "diagnosis": "No accionas la maneta sin el separador requerido cuando faltan rotor o pastillas.",
        "question": "¿Qué determina si un rotor está demasiado fino?",
        "answers": [
          "El espesor mínimo de su fabricante",
          "Que brille",
          "Que siga girando"
        ],
        "correct": 0
      },
      {
        "id": "6.6",
        "title": "Fundamentos del purgado hidráulico",
        "theory": "El purgado expulsa aire y renueva fluido según procedimiento. El aire se comprime mucho más que el líquido y puede aumentar recorrido. DOT y aceites minerales no son intercambiables; incluso los aceites minerales requieren la especificación correcta.",
        "steps": [
          "Identifica modelo y fluido exacto",
          "Prepara kit, bloque y protección según manual",
          "Estudia el orden de puertos y realiza la tarea solo con el procedimiento específico disponible."
        ],
        "diagnosis": "Una fuga debe corregirse: purgar repetidamente no repara un sello o una unión defectuosa.",
        "question": "¿Puedes mezclar DOT y aceite mineral?",
        "answers": [
          "No",
          "Sí, a partes iguales",
          "Sí, si tienen igual color"
        ],
        "correct": 0
      },
      {
        "id": "6.7",
        "title": "Pruebas de seguridad y asentamiento de pastillas",
        "theory": "El asentamiento crea una superficie de contacto adecuada entre pastilla y rotor. La secuencia depende del sistema. Antes de esa prueba deben estar correctas fijaciones, ausencia de fugas y respuesta estática.",
        "steps": [
          "Revisa seguros y fijaciones",
          "Comprueba ambos frenos en parado",
          "Sigue el asentamiento del fabricante en un lugar despejado y controlado."
        ],
        "diagnosis": "Si cambia el punto de contacto o aparece una fuga, detén la prueba y vuelve a inspeccionar.",
        "question": "¿Cuándo comienza el asentamiento?",
        "answers": [
          "Después de superar las comprobaciones estáticas",
          "Antes de fijar las ruedas",
          "Con pastillas contaminadas"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 7,
    "title": "Llantas, neumáticos y pinchazos",
    "lessons": [
      {
        "id": "7.1",
        "title": "Estructura de rines, cubiertas y cámaras",
        "theory": "Rin, cubierta y cámara cumplen funciones distintas. El talón mantiene la cubierta asentada; la cámara retiene aire en un sistema convencional. En tubeless, cinta, válvula y sellante colaboran para sellar.",
        "steps": [
          "Identifica rin, talón y fondo de rin",
          "Lee las medidas impresas",
          "Comprueba compatibilidad antes de desmontar."
        ],
        "diagnosis": "Un pinchazo en la cara interior de la cámara hace sospechar cinta o extremos de radios.",
        "question": "¿Qué protege la cámara de los orificios del rin?",
        "answers": [
          "El fondo o cinta de rin apropiado",
          "La cadena",
          "La zapata"
        ],
        "correct": 0
      },
      {
        "id": "7.2",
        "title": "Tipos de válvulas: Presta y Schrader",
        "theory": "Presta tiene un vástago fino y una pequeña tuerca de apertura; Schrader utiliza un núcleo accionado por el cabezal. La bomba debe tener cabezal adecuado. Una válvula inclinada puede indicar desplazamiento de la cámara.",
        "steps": [
          "Identifica la válvula",
          "Coloca el cabezal sin doblarla",
          "Infla y comprueba estanqueidad antes de poner el tapón."
        ],
        "diagnosis": "Si pierde al retirar la bomba, revisa cierre y núcleo antes de cambiar toda la cámara.",
        "question": "¿Qué compruebas antes de conectar la bomba?",
        "answers": [
          "Compatibilidad del cabezal",
          "La marca del sillín",
          "Que la cadena esté tensa"
        ],
        "correct": 0
      },
      {
        "id": "7.3",
        "title": "Cómo desmontar e instalar una llanta",
        "theory": "El canal central del rin facilita montar el talón al reducir el diámetro efectivo durante la operación. Palancas inapropiadas pueden pellizcar cámara o dañar rin. Debe salir todo el aire antes de desmontar.",
        "steps": [
          "Desinfla por completo",
          "Lleva el talón al canal central y desmonta con herramienta compatible",
          "Monta sin atrapar cámara y revisa asiento uniformemente al inflar."
        ],
        "diagnosis": "Un bulto en el talón exige desinflar e inspeccionar: no lo fuerces con más presión.",
        "question": "¿Qué haces si el talón queda irregular?",
        "answers": [
          "Desinflar y corregir el asiento",
          "Aumentar presión sin límite",
          "Rodar para que se acomode"
        ],
        "correct": 0
      },
      {
        "id": "7.4",
        "title": "Reparación de pinchazos y cambio de cámara",
        "theory": "Un parche repara la cámara, no elimina el objeto que causó el agujero. Dos cortes paralelos pueden indicar pellizco. Daño de válvula o desgarros grandes requieren otra solución.",
        "steps": [
          "Localiza y marca la fuga",
          "Inspecciona con cuidado interior de cubierta y cinta",
          "Aplica el kit según instrucciones o cambia cámara y verifica estanqueidad."
        ],
        "diagnosis": "Si pinchas de nuevo en el mismo punto, busca la causa que quedó en cubierta o rin.",
        "question": "¿Qué falta después de encontrar el agujero?",
        "answers": [
          "Eliminar la causa del pinchazo",
          "Cambiar el sillín",
          "Engrasar la cámara"
        ],
        "correct": 0
      },
      {
        "id": "7.5",
        "title": "Sistemas tubeless, sellantes y válvulas",
        "theory": "Tubeless necesita conjunto rin-cubierta compatible, cinta estanca, válvula y sellante adecuado. La compatibilidad hookless impone condiciones adicionales. El sellante no repara cualquier corte estructural.",
        "steps": [
          "Confirma compatibilidad y límites de presión",
          "Inspecciona cinta y válvula",
          "Sigue la cantidad y montaje indicados y comprueba fugas."
        ],
        "diagnosis": "Pérdida por los orificios de radios puede apuntar a cinta defectuosa, no a falta de sellante.",
        "question": "¿Qué debes verificar antes de montar tubeless?",
        "answers": [
          "Compatibilidad de rin y cubierta",
          "Solo que la válvula entre",
          "Solo que haya sellante"
        ],
        "correct": 0
      },
      {
        "id": "7.6",
        "title": "Presión correcta según el peso, terreno y neumático",
        "theory": "Presión depende de carga, volumen de cubierta, carcasa, terreno y montaje. El máximo no es la presión recomendada de uso. Deben respetarse todos los límites del sistema, especialmente rin y cubierta.",
        "steps": [
          "Consulta límites y una referencia del fabricante",
          "Mide en frío con manómetro",
          "Ajusta gradualmente según apoyo, golpes de rin y agarre sin salir del rango admitido."
        ],
        "diagnosis": "Golpes de rin con baja presión no siempre se arreglan subiendo mucho: revisa carga y volumen disponible.",
        "question": "¿El máximo escrito equivale a la presión ideal?",
        "answers": [
          "No, es un límite",
          "Sí, siempre",
          "Solo al ir cuesta abajo"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 8,
    "title": "Cambios y desviadores",
    "lessons": [
      {
        "id": "8.1",
        "title": "Funcionamiento de los cambios de velocidad",
        "theory": "El cambio desplaza la cadena entre coronas. Un piñón mayor reduce avance por pedalada y aumenta la ventaja mecánica ideal. Cambiar bajo carga excesiva castiga dientes y cadena.",
        "steps": [
          "Prueba relaciones en el banco",
          "Compara 32/16 y 32/32",
          "En una bicicleta operativa, alivia fuerza al cambiar según indicaciones del sistema."
        ],
        "diagnosis": "Un golpe al cambiar puede ser técnica bajo carga, pero también ajuste o desgaste.",
        "question": "¿Qué piñón facilita una subida a igual plato?",
        "answers": [
          "Uno mayor",
          "Uno menor",
          "Da igual siempre"
        ],
        "correct": 0
      },
      {
        "id": "8.2",
        "title": "Desviador delantero y trasero",
        "theory": "El desviador delantero guía entre platos; el trasero guía entre piñones y recoge longitud mediante su jaula. Su capacidad y tamaño máximo de piñón son restricciones diferentes.",
        "steps": [
          "Localiza jaula y roldanas",
          "Identifica capacidad y rango admitidos",
          "Observa recorrido sin forzar combinaciones incompatibles."
        ],
        "diagnosis": "Una jaula sin tensión puede indicar cadena larga o capacidad excedida, no solo resorte débil.",
        "question": "¿Qué hace también el cambio trasero?",
        "answers": [
          "Recoger variaciones de longitud de cadena",
          "Inflar la cubierta",
          "Apretar el rotor"
        ],
        "correct": 0
      },
      {
        "id": "8.3",
        "title": "Tornillos H, L y ajuste B",
        "theory": "H y L limitan extremos de recorrido; el ajuste B controla una separación geométrica según diseño. Los límites no sustituyen la indexación. Un límite incorrecto puede lanzar la cadena fuera del cassette.",
        "steps": [
          "Consulta qué extremo regula cada tornillo en tu modelo",
          "Verifica topes con movimientos lentos",
          "Ajusta B con la medida o plantilla especificada."
        ],
        "diagnosis": "No corrijas un fallo entre piñones intermedios girando topes indiscriminadamente.",
        "question": "¿Para qué sirven H y L?",
        "answers": [
          "Limitar los extremos de recorrido",
          "Ajustar presión de freno",
          "Cambiar la longitud de cadena"
        ],
        "correct": 0
      },
      {
        "id": "8.4",
        "title": "Ajuste de indexación y tensión del cable",
        "theory": "La indexación alinea cada posición del mando con un piñón. Tensión de cable y fricción influyen en esa correspondencia. Antes se necesita patilla alineada y componentes compatibles.",
        "steps": [
          "Inspecciona cable y fundas",
          "Sigue el procedimiento de indexación del sistema",
          "Haz cambios pequeños y comprueba subida y bajada en todo el cassette."
        ],
        "diagnosis": "Si funciona en una zona y falla en otra, sospecha alineación o compatibilidad además de tensión.",
        "question": "¿Qué ajusta la indexación?",
        "answers": [
          "La correspondencia mando-piñón",
          "El diámetro de rueda",
          "La fuerza del freno"
        ],
        "correct": 0
      },
      {
        "id": "8.5",
        "title": "Diagnóstico de cambios que saltan o no entran",
        "theory": "No entrar en una marcha y saltar bajo fuerza son problemas distintos. El primero puede ser mando, cable o alineación; el segundo, desgaste o engrane. Registrar cuándo falla evita ajustes al azar.",
        "steps": [
          "Prueba cada marcha sin carga en soporte",
          "Inspecciona desgaste y unión",
          "Solo con bici segura compara el síntoma bajo carga moderada."
        ],
        "diagnosis": "Si solo falla un piñón, revisa sus dientes y alineación antes de reemplazar todo el sistema.",
        "question": "¿Qué dato ayuda a diagnosticar?",
        "answers": [
          "En qué marcha y bajo qué carga falla",
          "Solo el color del cassette",
          "Solo la edad del sillín"
        ],
        "correct": 0
      },
      {
        "id": "8.6",
        "title": "Patilla del cambio y alineación",
        "theory": "La patilla coloca el cambio en una geometría precisa. Una desviación pequeña puede afectar varias marchas. Alinearla requiere referencia y herramienta; doblarla a ojo puede romperla o dañar el cuadro.",
        "steps": [
          "Inspecciona tras un golpe",
          "Comprueba fijación y referencia de patilla",
          "Mide con útil adecuado o deriva a taller si no lo tienes."
        ],
        "diagnosis": "Un cambio visualmente recto puede seguir desalineado respecto al plano de la rueda.",
        "question": "¿Cómo se verifica una patilla?",
        "answers": [
          "Con referencia y herramienta de alineación",
          "Solo mirando desde arriba",
          "Tensando más la cadena"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 9,
    "title": "Ruedas, radios y bujes",
    "lessons": [
      {
        "id": "9.1",
        "title": "Estructura de una rueda y distribución de cargas",
        "theory": "Una rueda de radios combina un rin comprimido con radios pretensados. La carga modifica sus tensiones; no equivale a un conjunto de varillas que solo empujan. El centrado lateral, radial y aparaguado son verificaciones diferentes.",
        "steps": [
          "Identifica rin, buje y lados de radios",
          "Gira la rueda con una referencia sin tocarla",
          "Distingue desplazamiento lateral de salto radial."
        ],
        "diagnosis": "Una rueda centrada visualmente puede tener tensiones desiguales y fatigarse.",
        "question": "¿Qué verificas además del centrado?",
        "answers": [
          "Tensión y aparaguado",
          "Solo color de radios",
          "Solo presión máxima"
        ],
        "correct": 0
      },
      {
        "id": "9.2",
        "title": "Radios, cabecillas y tensión",
        "theory": "La cabecilla ajusta longitud efectiva y tensión del radio. Tensión excesiva puede dañar rin; insuficiente permite movimientos y fatiga. El sonido sirve para comparar, pero no reemplaza medir cuando se requiere precisión.",
        "steps": [
          "Identifica llave de cabecilla exacta",
          "Mide tensión con tensiómetro y tabla del radio",
          "Compara con límites del rin y distribución entre lados."
        ],
        "diagnosis": "No iguales ciegamente tensión entre ambos lados: la geometría del buje puede exigir valores distintos.",
        "question": "¿De dónde sale la tensión admisible?",
        "answers": [
          "De la especificación del conjunto",
          "De apretar al máximo",
          "De que todos suenen idénticos"
        ],
        "correct": 0
      },
      {
        "id": "9.3",
        "title": "Cómo centrar una rueda desalineada",
        "theory": "Centrar requiere ajustes pequeños y seguimiento del efecto. Lateral, radial y tensión están relacionados. Una abolladura o grieta no se repara simplemente tensando radios.",
        "steps": [
          "Marca la desviación",
          "Anota ajustes pequeños con herramienta y referencia adecuadas",
          "Revisa tensión y aparaguado después de cada serie."
        ],
        "diagnosis": "Si hace falta una tensión extrema para corregir, revisa daño del rin o radios incorrectos.",
        "question": "¿Qué caracteriza un ajuste controlado?",
        "answers": [
          "Cambios pequeños y nueva medición",
          "Dar varias vueltas a todos",
          "Apretar solo el lado visible"
        ],
        "correct": 0
      },
      {
        "id": "9.4",
        "title": "Rodamientos y mantenimiento de bujes",
        "theory": "Un buje puede usar conos y bolas o cartuchos. Precarga y sellado influyen en suavidad y holgura. El ajuste debe comprobarse en la condición de montaje prevista.",
        "steps": [
          "Identifica construcción y manual",
          "Comprueba giro y juego con rueda montada",
          "Registra orden de sellos y separadores antes de intervenir."
        ],
        "diagnosis": "Aspereza con ajuste correcto puede indicar pistas o rodamientos dañados, no falta de apriete.",
        "question": "¿Qué síntoma busca una revisión de buje?",
        "answers": [
          "Juego o giro áspero",
          "Color de los puños",
          "Ruido del sillín únicamente"
        ],
        "correct": 0
      },
      {
        "id": "9.5",
        "title": "Ejes pasantes y cierres rápidos",
        "theory": "Un eje pasante rosca en la interfaz prevista; un cierre rápido utiliza una leva. No se ajustan igual. La rueda debe asentarse completamente y el cierre seguir su procedimiento específico.",
        "steps": [
          "Identifica el sistema",
          "Asienta la rueda y aplica el cierre indicado",
          "Comprueba sujeción, centrado y giro antes de rodar."
        ],
        "diagnosis": "Una palanca cerrada sin resistencia adecuada no demuestra sujeción; consulta el ajuste correcto.",
        "question": "¿Qué verifica el montaje de rueda?",
        "answers": [
          "Asiento y sujeción según el sistema",
          "Solo que la palanca mire arriba",
          "Que no falte pintura"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 10,
    "title": "Pedales, bielas y eje de centro",
    "lessons": [
      {
        "id": "10.1",
        "title": "Funcionamiento del sistema de pedaleo",
        "theory": "Bielas y eje convierten la fuerza del pedal en giro. El eje de centro soporta cargas mediante rodamientos. La eficiencia depende también de cadena, alineación y estado de apoyos.",
        "steps": [
          "Señala biela, eje y plato",
          "Gira sin carga y busca interferencias",
          "Compara esfuerzo útil con pérdidas por rozamiento."
        ],
        "diagnosis": "Un ruido al pedalear puede venir del pedal o sillín: no atribuyas todo al eje de centro.",
        "question": "¿Qué sostiene el giro del eje?",
        "answers": [
          "Los rodamientos",
          "La cinta del rin",
          "La pastilla de freno"
        ],
        "correct": 0
      },
      {
        "id": "10.2",
        "title": "Roscas y sentidos de apriete de los pedales",
        "theory": "Los pedales habituales tienen rosca derecha en el lado derecho y rosca izquierda en el izquierdo, mirando cada extremo desde fuera. El marcado L/R ayuda a evitar errores. No fuerces una rosca que no entra a mano.",
        "steps": [
          "Identifica L y R",
          "Limpia y prepara roscas como indica el fabricante",
          "Enrosca a mano antes de aplicar herramienta y par."
        ],
        "diagnosis": "Si se traba al primer giro, revisa lado, paso y alineación en vez de aumentar fuerza.",
        "question": "¿Qué pedal suele usar rosca izquierda?",
        "answers": [
          "El izquierdo",
          "El derecho",
          "Ambos usan siempre derecha"
        ],
        "correct": 0
      },
      {
        "id": "10.3",
        "title": "Desmontaje de bielas y platos",
        "theory": "Sistemas de biela usan extractores, autoextracción, tornillos de apriete o interfaces diferentes. El plato tiene montaje y orientación específicos. Una herramienta genérica puede dañar la unión.",
        "steps": [
          "Identifica el sistema",
          "Registra separadores y orientación",
          "Utiliza su procedimiento de desmontaje y montaje con pares indicados."
        ],
        "diagnosis": "Una biela que se afloja repetidamente exige revisar interfaz y daños, no solo reapretar.",
        "question": "¿Qué eliges antes de desmontar una biela?",
        "answers": [
          "El procedimiento de su interfaz",
          "El martillo más grande",
          "Una llave por color"
        ],
        "correct": 0
      },
      {
        "id": "10.4",
        "title": "Tipos de ejes de centro y compatibilidad",
        "theory": "Caja del cuadro, rosca o press-fit, ancho y diámetro de eje determinan compatibilidad. Los nombres comerciales no bastan. Separadores cambian posición de bielas y línea de cadena.",
        "steps": [
          "Mide o consulta la caja del cuadro",
          "Identifica diámetro y longitud útil del eje",
          "Verifica la combinación completa en tablas del fabricante."
        ],
        "diagnosis": "Un adaptador no es solución universal: puede alterar apoyo o separación.",
        "question": "¿Qué debe coincidir para elegir eje de centro?",
        "answers": [
          "Cuadro, eje y separadores requeridos",
          "Solo marca de cadena",
          "Solo diámetro de rueda"
        ],
        "correct": 0
      },
      {
        "id": "10.5",
        "title": "Diagnóstico de crujidos y juego mecánico",
        "theory": "El sonido se transmite por el cuadro y puede engañar sobre su origen. El diagnóstico compara pedaleo sentado/de pie, carga, lateralidad y giro. Holgura es movimiento relativo medible.",
        "steps": [
          "Registra cuándo aparece el crujido",
          "Revisa pedales, fijaciones y apoyos",
          "Aísla una interfaz por prueba antes de desmontar más."
        ],
        "diagnosis": "Un crujido solo sentado orienta también hacia sillín y tija.",
        "question": "¿Qué ayuda a localizar un crujido?",
        "answers": [
          "Cambiar una condición por prueba",
          "Cambiar todas las piezas juntas",
          "Apretar sin especificación"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 11,
    "title": "Dirección, manubrio y geometría",
    "lessons": [
      {
        "id": "11.1",
        "title": "Potencia, manubrio y sistema de dirección",
        "theory": "Potencia y manubrio transmiten el mando a la horquilla. El juego de dirección permite giro y soporta carga. En sistemas sin rosca, precarga y fijación de potencia cumplen funciones distintas.",
        "steps": [
          "Identifica tapa, tornillos de potencia y rodamientos",
          "Sigue el camino de fuerzas",
          "Consulta límites de inserción y sujeción."
        ],
        "diagnosis": "La tapa superior no sustituye el apriete final de la potencia.",
        "question": "¿Qué distingue un montaje sin rosca?",
        "answers": [
          "Precarga y sujeción son ajustes diferentes",
          "Todo depende de un solo tornillo",
          "No usa rodamientos"
        ],
        "correct": 0
      },
      {
        "id": "11.2",
        "title": "Rodamientos del juego de dirección",
        "theory": "Los rodamientos de dirección pueden ser integrados, semiintegrados o externos y tener ángulos específicos. Orden de apoyos y sellos importa. Un rodamiento parecido puede apoyar mal.",
        "steps": [
          "Registra referencia y orientación",
          "Inspecciona pistas y sellos",
          "Comprueba giro suave tras el montaje correcto."
        ],
        "diagnosis": "Una muesca al girar puede indicar daño de pistas aunque no haya holgura.",
        "question": "¿Qué importa además del diámetro del rodamiento?",
        "answers": [
          "Ángulos, altura y orientación",
          "Solo su brillo",
          "Solo cantidad de grasa"
        ],
        "correct": 0
      },
      {
        "id": "11.3",
        "title": "Cómo eliminar holguras",
        "theory": "En dirección sin rosca, la precarga elimina juego sin frenar el giro; después se fija la potencia. Exceso de precarga daña o endurece rodamientos. Sistemas roscados requieren otro procedimiento.",
        "steps": [
          "Identifica tu dirección",
          "Sigue el orden de ajuste del manual",
          "Comprueba juego y giro después de fijar la potencia."
        ],
        "diagnosis": "Movimiento al frenar también puede venir de bujes o frenos: localiza con la mano sobre la unión, sin tocar partes móviles.",
        "question": "¿Cuál es el resultado buscado?",
        "answers": [
          "Sin juego y con giro libre",
          "Giro duro para mayor seguridad",
          "Tapa apretada al máximo"
        ],
        "correct": 0
      },
      {
        "id": "11.4",
        "title": "Alineación del manubrio y la rueda",
        "theory": "Alinear potencia y rueda no corrige una horquilla torcida. La fijación debe respetar secuencia y pares, especialmente en manubrios de carbono. Cables no deben limitar el giro.",
        "steps": [
          "Asienta la rueda",
          "Alinea la potencia siguiendo su montaje",
          "Verifica pares y giro completo sin tirar de cables."
        ],
        "diagnosis": "Si la rueda queda torcida con la potencia alineada, revisa montaje y daños estructurales.",
        "question": "¿Qué revisas tras alinear?",
        "answers": [
          "Sujeción y libertad de giro",
          "Solo aspecto frontal",
          "Solo altura de sillín"
        ],
        "correct": 0
      },
      {
        "id": "11.5",
        "title": "Ajustes ergonómicos de sillín y postura",
        "theory": "Altura y posición de sillín, alcance y manetas influyen en control y comodidad. Las marcas de inserción y límites de raíles son restricciones mecánicas. Ajusta de forma gradual y registra cambios.",
        "steps": [
          "Anota posición inicial",
          "Cambia una variable dentro de límites",
          "Prueba en condiciones controladas y revisa comodidad y alcance de frenos."
        ],
        "diagnosis": "No compenses dolor persistente con ajustes extremos; puede requerir evaluación de postura profesional.",
        "question": "¿Cómo comparas ajustes ergonómicos?",
        "answers": [
          "Una variable por vez y registro",
          "Todo a la vez",
          "Fuera de marcas de inserción"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 12,
    "title": "Suspensión y amortiguación",
    "lessons": [
      {
        "id": "12.1",
        "title": "Horquillas rígidas y de suspensión",
        "theory": "Una horquilla rígida no tiene recorrido de suspensión; una suspendida permite desplazamiento guiado. Barras, botellas y retenes deben trabajar alineados. La suspensión no reemplaza presión correcta de neumático.",
        "steps": [
          "Identifica estructura y recorrido declarado",
          "Inspecciona barras y retenes",
          "Comprime según procedimiento sin golpear el tope."
        ],
        "diagnosis": "Un bloqueo de movimiento puede ser ajuste, daño o falta de mantenimiento; no lo fuerces.",
        "question": "¿Qué añade una horquilla de suspensión?",
        "answers": [
          "Recorrido controlado",
          "Frenado automático",
          "Cambio de marcha automático"
        ],
        "correct": 0
      },
      {
        "id": "12.2",
        "title": "Suspensión de aire y resorte",
        "theory": "El resorte almacena energía; el amortiguador controla la velocidad de movimiento. Aire y muelle ofrecen ajustes distintos. En un muelle lineal, precarga no cambia la rigidez k.",
        "steps": [
          "Identifica aire o muelle",
          "Busca configuración inicial del modelo",
          "Relaciona más carga con mayor hundimiento en el banco."
        ],
        "diagnosis": "Si no consigues el SAG dentro del rango de ajuste, revisa resorte y compatibilidad en lugar de exceder límites.",
        "question": "¿La precarga cambia la rigidez de un muelle lineal?",
        "answers": [
          "No",
          "Sí, siempre la duplica",
          "La vuelve cero"
        ],
        "correct": 0
      },
      {
        "id": "12.3",
        "title": "SAG, compresión y rebote",
        "theory": "SAG es hundimiento estático con ciclista y equipo. Compresión regula resistencia al hundirse; rebote, al extenderse. El objetivo depende del modelo y uso, no de un porcentaje universal.",
        "steps": [
          "Mide recorrido útil y hundimiento con el método del fabricante",
          "Calcula SAG=hundimiento/recorrido",
          "Ajusta una variable y registra respuesta."
        ],
        "diagnosis": "Rebote demasiado lento puede acumular hundimiento en impactos repetidos.",
        "question": "¿Qué controla el ajuste de rebote?",
        "answers": [
          "La velocidad de extensión",
          "La longitud de cadena",
          "La presión del freno"
        ],
        "correct": 0
      },
      {
        "id": "12.4",
        "title": "Mantenimiento externo de horquillas",
        "theory": "Limpiar barras y retenes reduce entrada de suciedad. Productos inapropiados pueden dañar sellos o contaminar frenos. El servicio interno tiene intervalos, fluidos y herramientas específicos.",
        "steps": [
          "Limpia exterior suavemente",
          "Inspecciona superficies y fugas",
          "Registra horas y programa servicio del modelo."
        ],
        "diagnosis": "Una película de lubricación no equivale automáticamente a fuga; observa cantidad, persistencia y manual.",
        "question": "¿Qué mantenimiento externo es razonable?",
        "answers": [
          "Limpieza suave e inspección",
          "Rociar cualquier aceite",
          "Abrir cámaras presurizadas"
        ],
        "correct": 0
      },
      {
        "id": "12.5",
        "title": "Diagnóstico de fugas, bloqueos y ruidos",
        "theory": "Fugas, ruidos y pérdida de recorrido requieren localizar el síntoma. Algunos conjuntos mantienen presión interna incluso desmontados. El servicio avanzado exige despresurización y procedimiento específicos.",
        "steps": [
          "Registra síntoma y ajuste",
          "Inspecciona externamente daños y pérdida de fluido",
          "Deriva servicio interno si faltan procedimiento o herramientas."
        ],
        "diagnosis": "No abras un amortiguador para buscar un ruido sin conocer sus cámaras y riesgos de presión.",
        "question": "¿Qué haces ante una fuga persistente?",
        "answers": [
          "Identificar modelo y gestionar servicio",
          "Seguir rodando hasta vaciarlo",
          "Apretar todas las tapas"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 13,
    "title": "Diagnóstico avanzado de fallas",
    "lessons": [
      {
        "id": "13.1",
        "title": "Metodología de diagnóstico por síntomas",
        "theory": "Diagnosticar es convertir un síntoma en hipótesis comprobables. Describe condición, frecuencia y componente sospechoso, prueba una variable y compara. Una reparación debe cerrar con verificación.",
        "steps": [
          "Escribe el síntoma sin asumir causa",
          "Ordena hipótesis por comprobación y riesgo",
          "Prueba y registra evidencia antes de sustituir."
        ],
        "diagnosis": "Cambiar piezas sin medir puede ocultar temporalmente el síntoma sin resolver la causa.",
        "question": "¿Qué viene antes de cambiar piezas?",
        "answers": [
          "Comprobar hipótesis",
          "Comprar el repuesto más caro",
          "Borrar el registro"
        ],
        "correct": 0
      },
      {
        "id": "13.2",
        "title": "Ruidos: chasquidos, rechinidos y crujidos",
        "theory": "Un ruido por vuelta de rueda sugiere elementos que giran con ella; por pedalada, transmisión o apoyos relacionados. El cuadro transmite sonido y dificulta localizarlo por oído solamente.",
        "steps": [
          "Compara frecuencia con rueda y biela",
          "Repite sentado y de pie si la bici es segura",
          "Aísla una unión y documenta el resultado."
        ],
        "diagnosis": "No ignores un ruido acompañado de grieta o movimiento estructural.",
        "question": "¿Qué información aporta la frecuencia?",
        "answers": [
          "Qué movimiento puede estar relacionado",
          "La marca exacta del fallo",
          "El par de todos los tornillos"
        ],
        "correct": 0
      },
      {
        "id": "13.3",
        "title": "Vibraciones, fricción y pérdida de eficiencia",
        "theory": "Rozamiento consume energía y puede generar calor; vibración puede venir de desequilibrio, holgura o frenado irregular. No toda resistencia procede del neumático.",
        "steps": [
          "Gira ruedas en soporte",
          "Busca contactos y holguras",
          "Compara antes y después de una corrección."
        ],
        "diagnosis": "Una rueda que se para pronto puede tener freno rozando, pero duración de giro sola no diagnostica rodamientos.",
        "question": "¿Cómo confirmas una causa de fricción?",
        "answers": [
          "Aislando contacto y comparando",
          "Solo contando segundos",
          "Subiendo presión sin revisar"
        ],
        "correct": 0
      },
      {
        "id": "13.4",
        "title": "Fallas simultáneas de transmisión y frenado",
        "theory": "Dos fallas simultáneas pueden producir síntomas distintos. Corregir transmisión no demuestra que el freno esté seguro. La secuencia debe priorizar condiciones que impiden usar la bicicleta y verificar cada sistema.",
        "steps": [
          "Separa síntomas de transmisión y freno",
          "Resuelve y comprueba el frenado antes de una prueba de rodaje",
          "Revisa después cada marcha y la unión de cadena."
        ],
        "diagnosis": "Que desaparezca un ruido no significa que ambos sistemas estén reparados.",
        "question": "¿Cuándo se considera completo el trabajo?",
        "answers": [
          "Cuando se verifican todos los fallos",
          "Cuando se arregla el primero",
          "Cuando el ruido disminuye"
        ],
        "correct": 0
      },
      {
        "id": "13.5",
        "title": "Inspección de daños estructurales",
        "theory": "Grietas, deformaciones, corrosión severa o daño por impacto pueden comprometer cuadro y horquilla. La inspección visual no descarta todo daño interno, especialmente en compuestos.",
        "steps": [
          "Limpia y observa zonas críticas",
          "Documenta golpes y anomalías",
          "Retira de uso y solicita evaluación cuando haya sospecha estructural."
        ],
        "diagnosis": "No intentes validar una grieta cargando la bicicleta hasta que falle.",
        "question": "¿Qué haces ante una posible grieta estructural?",
        "answers": [
          "Suspender uso y evaluar",
          "Pintarla encima",
          "Apretar la tija"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 14,
    "title": "Compatibilidad y sustitución de componentes",
    "lessons": [
      {
        "id": "14.1",
        "title": "Estándares de transmisión y velocidades",
        "theory": "El número de velocidades no define toda la compatibilidad. Tiro del mando, relación del cambio, separación de coronas y núcleo forman un sistema. Familias diferentes pueden usar interfaces distintas.",
        "steps": [
          "Anota referencias de mando, cambio y cassette",
          "Consulta tablas de compatibilidad",
          "Comprueba capacidad y rango además de velocidades."
        ],
        "diagnosis": "Que un cambio alcance el piñón grande no garantiza indexación correcta.",
        "question": "¿Basta que dos piezas digan 12 velocidades?",
        "answers": [
          "No",
          "Sí, siempre",
          "Solo si son negras"
        ],
        "correct": 0
      },
      {
        "id": "14.2",
        "title": "Compatibilidad de cadenas, cassettes y desviadores",
        "theory": "Ancho, perfil y diseño de cadena deben corresponder al sistema. El cassette requiere un núcleo adecuado; el cambio tiene límites de capacidad y piñón. La compatibilidad se verifica como conjunto.",
        "steps": [
          "Registra referencias completas",
          "Verifica cadena-cassette-plato y mando-cambio",
          "Confirma núcleo y separadores antes de comprar."
        ],
        "diagnosis": "Una cadena que entra físicamente puede no engranar como se diseñó.",
        "question": "¿Qué confirma compatibilidad?",
        "answers": [
          "La combinación documentada",
          "Solo que encaje",
          "Solo la marca de la bici"
        ],
        "correct": 0
      },
      {
        "id": "14.3",
        "title": "Medidas y estándares de ruedas y ejes",
        "theory": "Las medidas ETRTO distinguen ancho nominal y diámetro de asiento del talón. Eje también requiere diámetro, longitud, rosca y separación compatibles. Nombres como 29 pulgadas no bastan para toda selección.",
        "steps": [
          "Lee ETRTO de cubierta y rin",
          "Identifica dimensiones del eje",
          "Contrasta con cuadro y buje."
        ],
        "diagnosis": "Un eje que inicia la rosca no necesariamente tiene paso y longitud correctos.",
        "question": "¿Qué medida ayuda a elegir cubierta compatible?",
        "answers": [
          "Diámetro de asiento ETRTO",
          "Solo nombre comercial",
          "Solo altura del ciclista"
        ],
        "correct": 0
      },
      {
        "id": "14.4",
        "title": "Sistemas de montaje de frenos y rotores",
        "theory": "Post Mount, Flat Mount y otras interfaces requieren combinaciones autorizadas de cáliper, adaptador y rotor. El montaje del rotor al buje también varía. Mayor diámetro exige compatibilidad estructural.",
        "steps": [
          "Identifica montaje de cuadro y buje",
          "Consulta diámetros admitidos",
          "Selecciona adaptador, tornillos y rotor correctos."
        ],
        "diagnosis": "Un adaptador que permite atornillar no demuestra que cuadro y horquilla admitan ese rotor.",
        "question": "¿Qué limita aumentar el rotor?",
        "answers": [
          "Compatibilidad y límites del sistema",
          "Solo espacio visible",
          "Solo longitud de cable"
        ],
        "correct": 0
      },
      {
        "id": "14.5",
        "title": "Interpretación de manuales técnicos y especificaciones",
        "theory": "Un manual técnico especifica modelo, revisión, herramientas, secuencia, fluidos y pares. Un tutorial de otra generación puede omitir diferencias importantes. Mantén trazabilidad de la fuente usada.",
        "steps": [
          "Lee el código grabado de la pieza",
          "Busca su documento oficial",
          "Anota versión, página y valores aplicables en la ficha de trabajo."
        ],
        "diagnosis": "Si dos documentos difieren, verifica modelo y revisión antes de elegir el valor más conveniente.",
        "question": "¿Qué dato permite buscar el manual correcto?",
        "answers": [
          "Referencia exacta del componente",
          "Solo color",
          "Solo precio"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 15,
    "title": "Introducción a bicicletas eléctricas",
    "lessons": [
      {
        "id": "15.1",
        "title": "Arquitectura general de las e-bikes",
        "theory": "Una e-bike integra batería, controlador, sensores, motor y pantalla además de mecánica convencional. La asistencia añade energía al pedaleo, pero no elimina desgaste ni necesidad de frenos adecuados.",
        "steps": [
          "Identifica los bloques sin abrirlos",
          "Localiza manual y procedimiento de apagado",
          "Distingue conexiones eléctricas de cables mecánicos."
        ],
        "diagnosis": "Una avería de asistencia no implica que batería sea la causa: primero identifica síntomas y códigos.",
        "question": "¿Qué bloque gestiona la asistencia?",
        "answers": [
          "El controlador",
          "El fondo de rin",
          "El Quick Link"
        ],
        "correct": 0
      },
      {
        "id": "15.2",
        "title": "Motores de buje y motores centrales",
        "theory": "Un motor de buje actúa sobre una rueda; uno central entrega esfuerzo a través de la transmisión. El central aprovecha relaciones de cambio y añade carga a cadena y engranajes.",
        "steps": [
          "Localiza el motor",
          "Sigue el recorrido mecánico hasta la rueda",
          "Relaciona transmisión y asistencia sin desmontar el conjunto."
        ],
        "diagnosis": "Un salto de cadena en una central puede ser desgaste mecánico, no un fallo electrónico.",
        "question": "¿Qué motor utiliza la transmisión por cadena para impulsar?",
        "answers": [
          "El central",
          "Siempre cualquier motor de buje",
          "Ninguno"
        ],
        "correct": 0
      },
      {
        "id": "15.3",
        "title": "Sensores, controlador y asistencia al pedaleo",
        "theory": "Sensores de cadencia, torque o velocidad informan al controlador según sistema. La asistencia puede depender de varios permisos y límites. Posición de imán y conectores deben seguir el manual.",
        "steps": [
          "Lee códigos y condiciones de aparición",
          "Inspecciona externamente sensor e imán",
          "Comprueba alineación y cable visible sin puentear protecciones."
        ],
        "diagnosis": "Si el velocímetro falla junto con asistencia, el sensor de velocidad merece revisión antes del motor.",
        "question": "¿Cómo actúas ante un sensor sospechoso?",
        "answers": [
          "Inspección y procedimiento oficial",
          "Puenteando sus cables",
          "Eliminando límites del controlador"
        ],
        "correct": 0
      },
      {
        "id": "15.4",
        "title": "Inspección externa y seguridad de baterías",
        "theory": "La batería contiene celdas y protección electrónica. Golpes, hinchazón, calor anormal o conexiones dañadas requieren atención. No se abre el paquete como una reparación mecánica doméstica.",
        "steps": [
          "Con sistema apagado, inspecciona carcasa y fijación",
          "Usa solo carga y almacenamiento indicados",
          "Si hay daño o anomalía, deja de usar/cargar y consulta servicio autorizado."
        ],
        "diagnosis": "No pruebes una batería dañada conectándola a un cargador diferente.",
        "question": "¿Qué haces con una batería hinchada?",
        "answers": [
          "No usar ni cargar y gestionar servicio",
          "Perforarla",
          "Abrirla para enderezar celdas"
        ],
        "correct": 0
      },
      {
        "id": "15.5",
        "title": "Diagnóstico básico y cuándo acudir a servicio especializado",
        "theory": "El diagnóstico básico combina carga indicada, conexiones externas, códigos y síntomas. Separa fallo mecánico de asistencia. Reparación interna, firmware y mediciones eléctricas requieren herramientas y autorización adecuadas.",
        "steps": [
          "Registra código y versión del sistema",
          "Consulta la guía oficial de ese error",
          "Deriva cuando implique batería, motor interno o cableado dañado."
        ],
        "diagnosis": "Borrar un código sin corregir su causa no demuestra reparación.",
        "question": "¿Qué entregas al servicio especializado?",
        "answers": [
          "Código, síntomas y condiciones",
          "Solo una suposición",
          "Una batería abierta"
        ],
        "correct": 0
      }
    ]
  },
  {
    "id": 16,
    "title": "Taller profesional y proyecto final",
    "lessons": [
      {
        "id": "16.1",
        "title": "Procedimiento de recepción e inspección",
        "theory": "La recepción documenta estado, petición y limitaciones antes de intervenir. La inspección identifica riesgos y diferencia daño previo de trabajo pendiente. Las expectativas del usuario también forman parte del diagnóstico.",
        "steps": [
          "Registra referencias y estado con fotos",
          "Anota síntomas y uso",
          "Clasifica trabajos imprescindibles y opcionales antes de acordarlos."
        ],
        "diagnosis": "Una bici que entra por ruido puede tener un freno inseguro: informa del hallazgo y priorízalo.",
        "question": "¿Qué se documenta al recibir?",
        "answers": [
          "Estado, síntomas y alcance",
          "Solo nombre del cliente",
          "Solo precio de una cadena"
        ],
        "correct": 0
      },
      {
        "id": "16.2",
        "title": "Elaboración de diagnósticos y presupuestos",
        "theory": "Un presupuesto debe relacionar evidencia, operación, repuesto y coste. Distingue diagnóstico confirmado de sospecha pendiente. Cambios de alcance se comunican antes de ejecutar trabajo adicional.",
        "steps": [
          "Describe hallazgo y comprobación",
          "Separa mano de obra y piezas",
          "Explica qué verificación confirmará el resultado."
        ],
        "diagnosis": "No presentes una hipótesis como certeza para justificar sustituciones.",
        "question": "¿Qué sustenta un diagnóstico profesional?",
        "answers": [
          "Evidencia de comprobaciones",
          "El repuesto más caro",
          "La primera intuición"
        ],
        "correct": 0
      },
      {
        "id": "16.3",
        "title": "Gestión de herramientas y repuestos",
        "theory": "Herramientas calibradas, repuestos identificados y trazabilidad reducen errores. Piezas visualmente parecidas pueden no ser intercambiables. Almacena químicos y consumibles según instrucciones.",
        "steps": [
          "Etiqueta referencias y lotes útiles",
          "Controla estado de herramientas y calibración",
          "Separa componentes usados, nuevos y descartados."
        ],
        "diagnosis": "Una dinamométrica fuera de rango o mal conservada compromete la repetibilidad del montaje.",
        "question": "¿Qué evita confundir repuestos?",
        "answers": [
          "Identificación por referencia",
          "Ordenar solo por color",
          "Guardar todo en una caja"
        ],
        "correct": 0
      },
      {
        "id": "16.4",
        "title": "Control de calidad de una reparación",
        "theory": "Control de calidad verifica función, montaje y eliminación del síntoma. Incluye revisión estática antes de prueba dinámica. Registrar resultados hace reproducible la entrega.",
        "steps": [
          "Comprueba pares y seguros aplicables",
          "Verifica frenos, dirección, ruedas y transmisión",
          "Realiza prueba controlada si todo es seguro y documenta."
        ],
        "diagnosis": "Una prueba corta no reemplaza comprobar uniones críticas.",
        "question": "¿Qué debe confirmar la entrega?",
        "answers": [
          "Funcionamiento y eliminación del síntoma",
          "Solo limpieza",
          "Solo ausencia de piezas sobrantes"
        ],
        "correct": 0
      },
      {
        "id": "16.5",
        "title": "Mantenimiento integral de una bicicleta",
        "theory": "El mantenimiento integral sigue una secuencia: inspección, diagnóstico, operaciones acordadas, montaje y verificación. Evita desmontar sin necesidad componentes sellados o sin procedimiento disponible.",
        "steps": [
          "Elabora ficha por sistema",
          "Ejecuta tareas justificadas y registra medidas",
          "Repite inspección final y compara con los síntomas iniciales."
        ],
        "diagnosis": "Si aparece un síntoma nuevo, revisa la última intervención antes de continuar con más cambios.",
        "question": "¿Qué guía un mantenimiento integral?",
        "answers": [
          "Inspección y necesidades documentadas",
          "Desmontar todo por rutina",
          "Cambiar todos los rodamientos"
        ],
        "correct": 0
      },
      {
        "id": "16.6",
        "title": "Evaluación práctica final",
        "theory": "La evaluación final combina identificar piezas, seleccionar herramienta, diagnosticar con evidencia y verificar una reparación. Explicar por qué no intervienes una pieza también demuestra criterio.",
        "steps": [
          "Resuelve un caso de cadena y otro de freno en el taller",
          "Entrega diagnóstico, referencias y lista de comprobación",
          "Explica qué trabajo requeriría apoyo profesional."
        ],
        "diagnosis": "Una reparación simulada aprobada no sustituye la evaluación práctica de una bici real ni certifica competencia profesional.",
        "question": "¿Qué demuestra un buen resultado final?",
        "answers": [
          "Decisiones justificadas y verificación",
          "Solo rapidez",
          "Solo memorizar nombres"
        ],
        "correct": 0
      }
    ]
  }
];
