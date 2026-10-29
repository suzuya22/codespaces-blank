// Punto único de acceso a los datos: elige Firebase o el modo local según config.js
import * as firebase from './backendFirebase.js'
import * as local from './backendLocal.js'
import { MODO } from './config.js'

export const servicio = MODO === 'firebase' ? firebase : local
export { MODO }
export { mensajeError, normalizarUsuario } from './comun.js'
export { subirArchivo, validarArchivo, esModelo3D, extension, formatoPeso } from './archivos.js'
