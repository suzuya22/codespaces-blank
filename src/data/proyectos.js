// Contenido de ejemplo del sitio (primera versión, sin backend).
// Los nombres de proyectos y usuarios son ficticios.

export const MOTORES = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'unity', nombre: 'Unity' },
  { id: 'godot', nombre: 'Godot' },
  { id: 'unreal', nombre: 'Unreal' },
  { id: 'gamemaker', nombre: 'GameMaker' },
]

export const ESTADOS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'equipo', nombre: 'Buscando equipo' },
  { id: 'test', nombre: 'Test' },
]

export const PROYECTOS = [
  {
    id: 'ecos-del-abismo',
    titulo: 'Ecos del Abismo',
    autor: 'suzuya',
    motor: 'unity',
    estado: 'test',
    version: 'Alpha v0.3',
    generos: ['Roguelike', '2D', 'Pixel art'],
    feedbacks: 42,
    rating: 4.6,
    nuevo: false,
    paleta: ['#1a0f2e', '#6b2fb3', '#e04f6c', '#f2c14e'],
    sinopsis:
      'Roguelike de mazmorras donde cada sala reacciona al sonido que haces. Buscamos playtesters para probar el balance de los jefes.',
    busca: ['Playtesters', 'Feedback de dificultad'],
  },
  {
    id: 'chatarra-celeste',
    titulo: 'Chatarra Celeste',
    autor: 'lauraart',
    motor: 'godot',
    estado: 'equipo',
    version: 'Prototipo',
    generos: ['Plataformas', '2D', 'Cyberpunk'],
    feedbacks: 18,
    rating: 4.2,
    nuevo: true,
    paleta: ['#0d1b2a', '#1b6f8a', '#4fd1c5', '#f7a9d0'],
    sinopsis:
      'Plataformero 2D con mecánicas de hackeo en tiempo real. Se busca probar la fluidez del control y el balance de dificultad.',
    busca: ['Artista 2D', 'Compositor / SFX'],
  },
  {
    id: 'raices-de-silicio',
    titulo: 'Raíces de Silicio',
    autor: 'mateodev',
    motor: 'unreal',
    estado: 'equipo',
    version: 'Pre-alpha',
    generos: ['Aventura', '3D', 'Exploración'],
    feedbacks: 9,
    rating: 3.9,
    nuevo: true,
    paleta: ['#10220f', '#2f6b2a', '#9bd16a', '#f2e8b6'],
    sinopsis:
      'Exploración en un bosque mecánico donde la naturaleza se mezcla con circuitos. Buscamos animador 3D para criaturas.',
    busca: ['Animador 3D', 'Game designer'],
  },
  {
    id: 'bit-scape',
    titulo: 'Bit Scape',
    autor: 'pixelnauta',
    motor: 'gamemaker',
    estado: 'test',
    version: 'Demo',
    generos: ['Arcade', '2D', 'Retro'],
    feedbacks: 27,
    rating: 4.4,
    nuevo: false,
    paleta: ['#0b0b16', '#2b2d6e', '#6d7cff', '#ffffff'],
    sinopsis:
      'Arcade de escape en una red de datos. Partidas cortas, ideal para probar en móvil y dar feedback rápido.',
    busca: ['Playtesters'],
  },
  {
    id: 'lumbre',
    titulo: 'Lumbre',
    autor: 'suzuya',
    motor: 'godot',
    estado: 'test',
    version: 'Alpha v0.1',
    generos: ['Narrativo', '2D', 'Puzzle'],
    feedbacks: 14,
    rating: 4.8,
    nuevo: true,
    paleta: ['#1f0d0a', '#7a2e12', '#f08a24', '#ffe08a'],
    sinopsis:
      'Puzzle narrativo sobre una vela que debe iluminar una casa antes del amanecer. Buscamos feedback de la historia.',
    busca: ['Feedback narrativo'],
  },
  {
    id: 'hongo-errante',
    titulo: 'Hongo Errante',
    autor: 'mateodev',
    motor: 'unity',
    estado: 'equipo',
    version: 'Prototipo',
    generos: ['Cozy', '3D', 'Granja'],
    feedbacks: 6,
    rating: 4.0,
    nuevo: false,
    paleta: ['#1a1410', '#5c3d2e', '#c96f53', '#f4d6a0'],
    sinopsis:
      'Juego cozy de cultivo de hongos en un mundo subterráneo. Necesitamos programador de sistemas de inventario.',
    busca: ['Programador', 'Artista 3D'],
  },
]

export const ASSETS = [
  { id: 'caballero-16', titulo: 'Caballero 16px', autor: 'pixelnauta', paleta: ['#20203a', '#5a6acf', '#e6e6f0', '#f2c14e'] },
  { id: 'slime-pack', titulo: 'Slime pack', autor: 'lauraart', paleta: ['#0f2416', '#2f9e5a', '#9ef0b5', '#ffffff'] },
  { id: 'aldeanos', titulo: 'Aldeanos animados', autor: 'lauraart', paleta: ['#2a1a12', '#a0522d', '#f4c28c', '#3b5bdb'] },
  { id: 'fx-fuego', titulo: 'FX de fuego', autor: 'suzuya', paleta: ['#1a0a05', '#c0392b', '#f39c12', '#ffeaa7'] },
]

export const USUARIOS = {
  suzuya: {
    usuario: 'suzuya',
    nombre: 'Suzuya',
    pronombres: 'he/him',
    rol: 'Programador / Artista 2D',
    insignias: ['Playtester top', 'Alpha builder', 'Colaborador activo'],
    sobreMi:
      'Estudiante de ingeniería y creador apasionado de juegos 2D/3D. Busca colaboradores para proyectos de acción y plataformas.',
    habilidades: ['Unity', 'C#', 'Game design', 'Git', 'Pixel art básico'],
  },
  lauraart: {
    usuario: 'lauraart',
    nombre: 'Laura',
    pronombres: 'she/her',
    rol: 'Artista 2D / Animadora',
    insignias: ['Artista destacada', 'Colaboradora activa'],
    sobreMi: 'Ilustradora y animadora de sprites. Me encantan los mundos con mucho color y los personajes pequeñitos.',
    habilidades: ['Aseprite', 'Animación 2D', 'Concept art'],
  },
  mateodev: {
    usuario: 'mateodev',
    nombre: 'Mateo',
    pronombres: 'he/him',
    rol: 'Game designer',
    insignias: ['Alpha builder'],
    sobreMi: 'Diseñador de sistemas. Prototipo rápido y me obsesiona el balance.',
    habilidades: ['Unreal', 'Blueprints', 'Diseño de niveles'],
  },
  pixelnauta: {
    usuario: 'pixelnauta',
    nombre: 'Pixelnauta',
    pronombres: 'they/them',
    rol: 'Desarrollador arcade',
    insignias: ['Playtester top'],
    sobreMi: 'Hago juegos cortos y rápidos. Siempre dispuesto a probar demos ajenas.',
    habilidades: ['GameMaker', 'GML', 'Chiptune'],
  },
}

export const CONVERSACIONES = [
  {
    usuario: 'lauraart',
    mensajes: [
      { de: 'lauraart', texto: '¡Hola! Vi tu prototipo de Ecos del Abismo, me encantó la atmósfera.' },
      { de: 'yo', texto: 'Gracias, Laura. ¿Te interesaría ayudar con los sprites de los enemigos?' },
      { de: 'lauraart', texto: 'Claro. Puedo hacer una prueba con dos enemigos animados en 16px y te la paso esta semana.' },
      { de: 'yo', texto: 'Perfecto, te comparto el documento de diseño.' },
    ],
  },
  {
    usuario: 'mateodev',
    mensajes: [{ de: 'mateodev', texto: '¿Probaste la nueva build de Raíces de Silicio?' }],
  },
  {
    usuario: 'pixelnauta',
    mensajes: [{ de: 'pixelnauta', texto: 'Dejé feedback en tu demo, revisa la sección de bugs.' }],
  },
]

export function buscarProyecto(id) {
  return PROYECTOS.find((p) => p.id === id)
}

export function nombreMotor(id) {
  return MOTORES.find((m) => m.id === id)?.nombre ?? id
}
