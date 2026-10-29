// =========================================================
// Subida de archivos (modelos 3D, portadas, avatares) a Cloudinary.
// Si en el futuro activan el plan Blaze de Firebase, solo hay que
// reemplazar la función subirArchivo() por una con Firebase Storage.
// =========================================================
import { cloudinaryConfig, CLOUDINARY_LISTO, MAX_MB, FORMATOS_3D, MODO } from './config.js'
import { ErrorDevNet } from './comun.js'

export const extension = (nombre = '') => nombre.split('.').pop().toLowerCase()
export const esModelo3D = (file) => FORMATOS_3D.includes(extension(file?.name))

export function validarArchivo(file, tipo) {
  if (file.size > MAX_MB * 1024 * 1024) throw new ErrorDevNet('archivo-grande')
  if (tipo === 'modelo' && !esModelo3D(file)) throw new ErrorDevNet('formato-invalido')
  if (tipo === 'imagen' && !file.type.startsWith('image/')) throw new ErrorDevNet('formato-invalido')
}

// Reduce imágenes grandes antes de subirlas (más rápido y ahorra créditos)
async function comprimirImagen(file, maxLado = 1200) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  const img = await createImageBitmap(file)
  const escala = Math.min(1, maxLado / Math.max(img.width, img.height))
  if (escala === 1 && file.size < 1.5 * 1024 * 1024) return file
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * escala)
  canvas.height = Math.round(img.height * escala)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85))
  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
}

const leerComoDataURL = (file) =>
  new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(lector.result)
    lector.onerror = reject
    lector.readAsDataURL(file)
  })

/**
 * Sube un archivo y devuelve { url, nombre, formato, bytes }.
 * tipo: 'modelo' | 'imagen'   ·   onProgreso(0..1)
 */
export async function subirArchivo(file, { tipo, carpeta = 'devnet', onProgreso } = {}) {
  validarArchivo(file, tipo)
  const archivo = tipo === 'imagen' ? await comprimirImagen(file) : file
  const info = { nombre: file.name, formato: extension(file.name), bytes: archivo.size }

  // Sin Cloudinary configurado: imágenes en el navegador; modelos solo durante esta sesión
  if (!CLOUDINARY_LISTO) {
    // Con Firebase activo, un modelo sin Cloudinary no se podría ver desde otras cuentas
    if (MODO === 'firebase' && tipo === 'modelo') throw new ErrorDevNet('cloudinary-sin-configurar')
    onProgreso?.(1)
    if (tipo === 'imagen') return { ...info, url: await leerComoDataURL(await comprimirImagen(file, 640)) }
    return { ...info, url: URL.createObjectURL(file), temporal: true }
  }

  // Imágenes como "image" (permite transformaciones); modelos como "raw" (se guardan intactos)
  const recurso = tipo === 'imagen' ? 'image' : 'raw'
  const datos = new FormData()
  datos.append('file', archivo)
  datos.append('upload_preset', cloudinaryConfig.uploadPreset)
  datos.append('folder', `${carpeta}/${tipo === 'imagen' ? 'imagenes' : 'modelos'}`)

  const respuesta = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${recurso}/upload`)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgreso?.(e.loaded / e.total)
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) resolve(json)
        else reject(Object.assign(new ErrorDevNet('subida-fallida'), { detalle: json?.error?.message }))
      } catch {
        reject(new ErrorDevNet('subida-fallida'))
      }
    }
    xhr.onerror = () => reject(new ErrorDevNet('subida-fallida'))
    xhr.send(datos)
  })
  onProgreso?.(1)
  return { ...info, url: respuesta.secure_url, bytes: respuesta.bytes ?? archivo.size }
}

export function formatoPeso(bytes = 0) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}
