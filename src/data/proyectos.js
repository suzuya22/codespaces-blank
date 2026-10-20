// Contenido de la plataforma DevNet con soporte para assets reales y fallbacks procedurales.

export const MOTORES = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'godot', nombre: 'Godot', logo: 'images/logos/godot.png' },
  { id: 'unity', nombre: 'Unity', logo: 'images/logos/unity.png' },
  { id: 'unreal', nombre: 'Unreal', logo: 'images/logos/unreal.png' },
]

export const ESTADOS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'equipo', nombre: 'Buscando equipo' },
  { id: 'test', nombre: 'Test' },
]

export const PROYECTOS = [
  {
    id: 'cult-of-the-lamb',
    titulo: 'Cult of the Lamb',
    autor: 'suzuya',
    motor: 'unity',
    estado: 'equipo',
    version: 'Alpha v0.3',
    generos: ['Roguelike', 'Acción', 'Indie'],
    feedbacks: 18,
    rating: 4.8,
    nuevo: true,
    portada: 'images/proyectos/cult-of-the-lamb.png',
    paleta: ['#1a0f2e', '#6b2fb3', '#e04f6c', '#f2c14e'],
    sinopsis:
      'Funda tu propia secta en una tierra de falsos profetas e infieles. Crea una comunidad leal de adoradores del bosque y difunde tu palabra para convertirte en la única secta verdadera.',
    busca: ['Playtesters', 'Artista 2D'],
  },
  {
    id: 'the-binding-of-isaac',
    titulo: 'The Binding of Isaac',
    autor: 'suzuya',
    motor: 'unity',
    estado: 'test',
    version: 'Demo Playtest',
    generos: ['Platformer 2D', 'Roguelike', 'Hackeo'],
    feedbacks: 42,
    rating: 4.9,
    nuevo: false,
    portada: 'images/proyectos/binding-of-isaac.png',
    sinopsis:
      'Platformer 2D con mecánicas de hackeo en tiempo real. Se busca probar la fluidez del control y el balance de dificultad.',
    busca: ['Artista Pixel Art (2D)', 'Diseñador de Sonido / SFX'],
  },
  {
    id: 'night-in-the-woods',
    titulo: 'Night in the Woods',
    autor: 'lauraart',
    motor: 'unity',
    estado: 'equipo',
    version: 'Alpha v0.2',
    generos: ['Aventura', 'Narrativo', '2D'],
    feedbacks: 31,
    rating: 4.7,
    nuevo: true,
    portada: 'images/proyectos/night-in-the-woods.png',
    paleta: ['#0d1b2a', '#1b6f8a', '#4fd1c5', '#f7a9d0'],
    sinopsis:
      'Aventura narrativa sobre el regreso a casa, la juventud y los misterios que habitan en los oscuros bosques de Possum Springs.',
    busca: ['Guionista', 'Animador 2D'],
  },
  {
    id: 'another-door',
    titulo: 'Another Door',
    autor: 'mateodev',
    motor: 'godot',
    estado: 'test',
    version: 'Beta 1.0',
    generos: ['Puzzle', 'Escape Room', 'Misterio'],
    feedbacks: 15,
    rating: 4.5,
    nuevo: false,
    portada: 'images/proyectos/another-door.png',
    paleta: ['#10220f', '#2f6b2a', '#9bd16a', '#f2e8b6'],
    sinopsis:
      'Juego de puzzles e investigación con temática de escape room y criaturas misteriosas tras cada umbral.',
    busca: ['Compositor SFX'],
  },
  {
    id: 'bit-scape',
    titulo: 'Bit Scape',
    autor: 'pixelnauta',
    motor: 'unity',
    estado: 'test',
    version: 'Demo v0.1',
    generos: ['Arcade', '2D', 'Retro', 'Móvil'],
    feedbacks: 27,
    rating: 4.9,
    nuevo: true,
    portada: 'images/proyectos/bit-scape.png',
    juegoUrl: 'games/bit-scape/index.html',
    formato: 'vertical',
    paleta: ['#0b0b16', '#2b2d6e', '#6d7cff', '#ffffff'],
    sinopsis:
      'Arcade de escape en una red de datos. Diseñado para pantalla vertical móvil. Partidas cortas, ideal para probar en móvil y dar feedback rápido.',
    busca: ['Playtesters', 'Artista SFX'],
  },
  {
    id: 'kitsune-odyssey',
    titulo: 'Kitsune Odyssey',
    autor: 'suzuya',
    motor: 'unreal',
    estado: 'equipo',
    version: 'Pre-Alpha',
    generos: ['3D', 'Aventura', 'Acción'],
    feedbacks: 9,
    rating: 4.3,
    nuevo: true,
    portada: 'images/proyectos/fox-girl-3d.png',
    paleta: ['#1f0d0a', '#7a2e12', '#f08a24', '#ffe08a'],
    sinopsis:
      'Exploración y combate en tercera persona con modelado anime estilizado y shader de sombreado cel.',
    busca: ['Animador 3D / Rigging'],
  },
]

export const ASSETS = [
  {
    id: 'chico-spritesheet',
    titulo: 'Spritesheet Héroe 2D',
    autor: 'suzuya',
    tipo: 'Animación (Caminar / Correr)',
    imagen: 'images/assets/chico-spritesheet.png',
  },
  {
    id: 'chica-spritesheet',
    titulo: 'Spritesheet Chica Casual',
    autor: 'lauraart',
    tipo: 'Animación (Caminar)',
    imagen: 'images/assets/chica-spritesheet.png',
  },
  {
    id: 'animacion-caminar',
    titulo: 'Ciclo de Caminado 8-Frames',
    autor: 'mateodev',
    tipo: 'Sprite Pixel Art',
    imagen: 'images/assets/animacion-caminar.png',
  },
  {
    id: 'modelo-3d-wireframe',
    titulo: 'Malla 3D Cabeza Anime',
    autor: 'suzuya',
    tipo: 'Modelo 3D Wireframe',
    imagen: 'images/assets/modelo-3d-wireframe.png',
  },
  {
    id: 'modelo-3d-rig',
    titulo: 'Rigging Bípedo Completo',
    autor: 'suzuya',
    tipo: 'Rig 3D / Armature',
    imagen: 'images/assets/modelo-3d-rig.png',
  },
]

export const USUARIOS = {
  suzuya: {
    usuario: 'suzuya',
    nombre: 'Suzuya',
    pronombres: 'he/him',
    rol: 'Programador / Artista 2D',
    avatar: 'images/avatares/suzuya.png',
    banner: 'images/banners/perfil-banner.png',
    insignias: ['Playtester top ★ Alpha builder', 'Colaborador activo'],
    sobreMi:
      'Estudiante de ingeniería y creador apasionado de juegos 2D/3D. Busca colaboradores para proyectos de acción y plataformas.',
    habilidades: ['Unity', 'C#', 'Game design', 'Git', 'Pixel art básico'],
  },
  lauraart: {
    usuario: 'lauraart',
    nombre: 'Laura',
    pronombres: 'she/her',
    rol: 'Artista 2D / Animadora',
    avatar: 'images/avatares/lauraart.png',
    insignias: ['Artista Destacada', 'Colaboradora Activa'],
    sobreMi: 'Ilustradora y animadora de sprites. Me encantan los mundos con mucho color y los personajes pequeñitos.',
    habilidades: ['Aseprite', 'Animación 2D', 'Concept art'],
  },
  mateodev: {
    usuario: 'mateodev',
    nombre: 'Mateo',
    pronombres: 'he/him',
    rol: 'Game designer',
    avatar: 'images/avatares/mateodev.png',
    insignias: ['Alpha Builder'],
    sobreMi: 'Diseñador de sistemas. Prototipo rápido y me obsesiona el balance.',
    habilidades: ['Unreal', 'Blueprints', 'Diseño de niveles'],
  },
  pixelnauta: {
    usuario: 'pixelnauta',
    nombre: 'Pixelnauta',
    pronombres: 'they/them',
    rol: 'Desarrollador arcade',
    avatar: 'images/avatares/avatar-3.png',
    insignias: ['Playtester Top'],
    sobreMi: 'Hago juegos cortos y rápidos. Siempre dispuesto a probar demos ajenas.',
    habilidades: ['GameMaker', 'GML', 'Chiptune'],
  },
}

// Conversaciones de ejemplo (la hora es relativa al momento en que se abre el sitio)
const hace = (min) => Date.now() - min * 60 * 1000

export const CONVERSACIONES = [
  {
    usuario: 'lauraart',
    mensajes: [
      { de: 'lauraart', texto: '¡Hola! Vi el prototipo de Cult of the Lamb, la atmósfera está increíble 🐑', hora: hace(95) },
      { de: 'yo', texto: '¡Gracias, Laura! Justo estamos buscando un artista 2D para los enemigos del segundo bioma.', hora: hace(92) },
      { de: 'lauraart', texto: 'Me encantaría ayudar. Puedo hacer una prueba con dos enemigos animados en 32px y te los paso esta semana.', hora: hace(88) },
      { de: 'yo', texto: 'Perfecto. Te comparto el documento de diseño y la paleta de colores que estamos usando.', hora: hace(85) },
      { de: 'lauraart', texto: '¡Listo! Cuando lo tenga te aviso por aquí 😊', hora: hace(80) },
    ],
  },
  {
    usuario: 'mateodev',
    mensajes: [
      { de: 'mateodev', texto: 'Oye, ¿probaste la nueva build de Another Door?', hora: hace(300) },
      { de: 'yo', texto: 'Todavía no, ¿qué cambió?', hora: hace(290) },
      { de: 'mateodev', texto: 'Rehice el puzzle de la segunda puerta, ahora es más claro. Me sirve tu feedback 🙏', hora: hace(280) },
    ],
  },
  {
    usuario: 'pixelnauta',
    mensajes: [
      { de: 'pixelnauta', texto: 'Dejé feedback en tu demo, revisa la sección de bugs.', hora: hace(1500) },
    ],
  },
]

export function buscarProyecto(id) {
  return PROYECTOS.find((p) => p.id === id)
}

export function nombreMotor(id) {
  return MOTORES.find((m) => m.id === id)?.nombre ?? id
}
