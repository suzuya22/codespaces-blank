# Conectar DevNet con Firebase y Cloudinary

DevNet usa dos servicios gratuitos (ninguno pide tarjeta):

| Servicio | Para qué | Plan |
|---|---|---|
| **Firebase Authentication** | Crear cuentas e iniciar sesión (correo/contraseña y Google) | Spark (gratis) |
| **Cloud Firestore** | Guardar perfiles, proyectos y reseñas; todas las cuentas ven lo mismo en tiempo real | Spark (gratis) |
| **Cloudinary** | Guardar archivos: modelos 3D (GLB, GLTF, OBJ, STL, FBX), portadas y fotos de perfil | Free (25 créditos/mes) |

> ¿Por qué no Firebase Storage? Desde febrero de 2026 Firebase Storage exige el plan Blaze (con tarjeta de crédito). Cloudinary cubre lo mismo sin tarjeta. Si algún día activan Blaze, solo hay que cambiar la función `subirArchivo()` en `src/servicios/archivos.js`.

Mientras `src/servicios/config.js` tenga los valores de ejemplo, el sitio funciona en **modo local**: las cuentas y proyectos se guardan solo en el navegador. Sirve para probar la interfaz, pero otras personas no ven lo que publicas.

---

## 1. Crear el proyecto de Firebase

1. Entra a <https://console.firebase.google.com> con tu cuenta de Google.
2. **Crear un proyecto** → nombre `devnet` (o el que quieras) → puedes desactivar Google Analytics → **Crear proyecto**.
3. En la página del proyecto haz clic en el ícono **`</>` (Web)** para registrar una app web.
   - Apodo: `devnet-web`. **No** marques Firebase Hosting (usamos GitHub Pages).
   - Firebase te muestra un bloque `const firebaseConfig = { ... }`.
4. Copia esos valores en `src/servicios/config.js`, dentro de `firebaseConfig`:

```js
export const firebaseConfig = {
  apiKey: 'AIza...',
  authDomain: 'devnet-xxxx.firebaseapp.com',
  projectId: 'devnet-xxxx',
  storageBucket: 'devnet-xxxx.firebasestorage.app',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef',
}
```

> Estos datos **no son secretos**: van en el código del navegador en cualquier app web con Firebase. Lo que protege los datos son las reglas del paso 3.

## 2. Activar las cuentas (Authentication)

1. Menú lateral → **Compilación → Authentication → Comenzar**.
2. Pestaña **Método de acceso**:
   - **Correo electrónico/contraseña** → Habilitar → Guardar.
   - **Google** → Habilitar → elige un correo de asistencia → Guardar.
3. Pestaña **Configuración → Dominios autorizados → Agregar dominio** → `suzuya22.github.io`.
   (`localhost` ya viene incluido para `npm run dev`.)

## 3. Crear la base de datos (Firestore) y sus reglas

1. Menú lateral → **Compilación → Firestore Database → Crear base de datos**.
2. Ubicación: `southamerica-east1` (São Paulo) o `us-central1`. No se puede cambiar después.
3. Elige **Iniciar en modo de producción**.
4. Abre la pestaña **Reglas**, borra lo que haya, pega todo el contenido de `firestore.rules` (está en la raíz del repositorio) y pulsa **Publicar**.

Qué permiten las reglas:
- Cualquiera puede **ver** perfiles, proyectos y reseñas (así las cuentas ven los proyectos de las demás).
- Solo una cuenta con sesión puede publicar, y solo a su nombre.
- Solo el dueño puede editar su perfil o borrar sus proyectos y reseñas.
- Los nombres de usuario son únicos y no se pueden cambiar.

- Los mensajes privados solo los leen las dos personas de la conversación.
- Las solicitudes para unirse solo las ven quien las envía y el creador del proyecto.

Las colecciones se crean solas la primera vez que alguien se registra, publica o escribe:
`usuarios`, `usuariosPorNombre`, `proyectos`, `resenas`, `conversaciones` y `solicitudes`.

> **Cada vez que cambie `firestore.rules`** hay que volver a pegarlo en la pestaña **Reglas** y pulsar **Publicar**.

## 4. Cloudinary para los archivos 3D e imágenes

1. Crea una cuenta gratuita en <https://cloudinary.com/users/register_free>.
2. En el **Dashboard** (Home) copia el **Cloud name** (por ejemplo `dxyz123ab`).
3. Ve a **Settings (⚙) → Upload → Upload presets → Add upload preset**:
   - **Upload preset name:** `devnet_publico`
   - **Signing mode:** `Unsigned`
   - **Asset folder:** `devnet` (opcional)
   - En **Upload control / Restrictions** (si aparece):
     - Max file size: `10000000` (10 MB)
     - Allowed formats: `jpg,jpeg,png,webp,gif,glb,gltf,obj,stl,fbx`
   - **Save**.
4. Pega el Cloud name en `src/servicios/config.js`:

```js
export const cloudinaryConfig = {
  cloudName: 'dxyz123ab',
  uploadPreset: 'devnet_publico',
}
```

> Recomendación para los modelos: exporta en **GLB** (un solo archivo con texturas). Un GLTF que dependa de archivos `.bin` o texturas aparte no se verá completo.

## 5. Probar

```bash
npm install
npm run dev
```

1. Abre la dirección que muestra la terminal (por ejemplo `http://localhost:5173/`) → **Registrarse**.
2. Publica un proyecto con portada y un modelo 3D.
3. Abre el sitio en otro navegador (o en modo incógnito), crea otra cuenta y comprueba que ves el proyecto y puedes dejarle feedback.
4. En la consola de Firebase → Firestore verás los documentos nuevos; en Cloudinary → Media Library, los archivos.

Cuando todo funcione, haz commit y push: GitHub Actions publica el sitio con la configuración nueva.

## Problemas frecuentes

| Mensaje | Solución |
|---|---|
| "Este dominio no está autorizado en Firebase" | Paso 2.3: agrega `suzuya22.github.io` a dominios autorizados. |
| "No tienes permiso para hacer esto" | No publicaste las reglas del paso 3.4 o no has iniciado sesión. |
| "No se pudo subir el archivo" | Revisa que el preset se llame `devnet_publico` y esté en **Unsigned**, y que el Cloud name sea correcto. |
| "Este método de inicio de sesión no está activado" | Paso 2.2: habilita Correo/contraseña o Google. |
| El modelo se ve negro o sin texturas | Expórtalo como GLB con las texturas incluidas. |
