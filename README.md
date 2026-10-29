# DevNet — Comunidad indie

> **Donde el desarrollo indie cobra vida.**
> Comparte prototipos, recibe feedback real y encuentra tu equipo.

DevNet es una plataforma web para creadores de videojuegos independientes: programadores, artistas, animadores, compositores y game designers pueden publicar sus prototipos, pedir playtesting y armar equipos de trabajo.

Proyecto del curso **Diseño adaptable** — Universidad Pontificia Bolivariana, 2026-2.

🔗 **Sitio publicado:** https://suzuya22.github.io/codespaces-blank/

---

## Entrega #4 — Cuentas reales, modelos 3D y colaboración

El sitio pasa de datos de ejemplo a una comunidad real: cada persona crea su cuenta, publica sus proyectos y todas las cuentas ven lo que publican las demás.

- **Cuentas de usuario (Firebase Authentication):** registro con nombre de usuario único y rol, inicio de sesión con correo o con Google y recuperación de contraseña por correo.
- **Base de datos compartida (Cloud Firestore):** perfiles, proyectos, reseñas, mensajes y solicitudes se guardan en la nube y se actualizan en tiempo real para todos.
- **Modelos 3D:** al publicar se puede subir un modelo **GLB, GLTF, OBJ, STL o FBX** (máx. 10 MB). Se ve en un **visor 3D interactivo** hecho con three.js (girar, zoom, centrar, auto‑giro), tanto en la vista previa como en la página del proyecto. Las tarjetas muestran la insignia **◆ 3D** y Explorar tiene el filtro "Solo con modelo 3D".
- **Archivos en Cloudinary:** portadas, fotos de perfil y modelos 3D se alojan en Cloudinary (plan gratuito, sin tarjeta). Firebase Storage exige el plan de pago desde 2026.
- **Perfiles reales:** perfil público de cada cuenta con sus proyectos y los feedbacks que ha dado. En tu propio perfil puedes editar foto, nombre, rol, sobre mí, habilidades y enlaces (itch.io, GitHub).
- **Feedback con autor:** publicar y comentar requiere sesión; cada reseña muestra quién la escribió y cuándo. El dueño de un proyecto puede eliminarlo.
- **Mensajes entre usuarios:** chats privados en tiempo real entre dos cuentas, con aviso de mensajes sin leer. Se inicia una conversación con "Enviar mensaje" desde cualquier perfil.
- **Solicitudes para unirse al equipo:** "Solicitar unirme al equipo" envía una solicitud (con mensaje opcional) que le llega al creador como **notificación en su perfil**. Desde la pestaña *Solicitudes* puede aceptar (se abre el chat con la persona) o rechazar.
- **Seguridad:** reglas de Firestore (`firestore.rules`) — todo lo público se puede leer, pero solo el dueño edita o borra lo suyo, y los chats solo los leen sus dos participantes.
- **Modo local:** si Firebase no está configurado, el sitio funciona guardando los datos en el navegador, útil para probar la interfaz sin conexión.

La configuración paso a paso de Firebase y Cloudinary está en [`FIREBASE.md`](FIREBASE.md).

## Entrega #3 — Rediseño visual y reactividad

- Cambio visual del sitio: barra superior en morado más claro y semitransparente, tipografía de botones unificada, etiquetas en mayúsculas y mayúsculas/minúsculas consistentes en los botones.
- Accesibilidad de la navegación: espaciado entre letras para que las serifas no se toquen (WCAG 1.4.12).
- Inicio más amplio en escritorio y manifiesto adaptable a todos los tamaños.
- Mejor reactividad: el juego de prueba (WebGL) se ajusta al tamaño del celular, los paneles ya no se desbordan con textos largos y la ficha técnica se actualiza al instante cuando alguien deja una reseña.
- Los proyectos nuevos aparecen de inmediato en Explorar.
- Centro de mensajes organizado: lista de chats, conversación y perfil del contacto según el tamaño de pantalla.

## Entrega #2

- Diseño en borrador y wireframe digital de la **versión tablet**.
- Diseño en alta de la **versión móvil** en Figma.
- Primera versión del sitio en **React**, con secciones, componentes y navegación.
- Publicación en **GitHub Pages**.

## Secciones del sitio

| Ruta | Sección | Descripción |
| --- | --- | --- |
| `/` | Inicio | Destacados / Nuevo, buscador, videojuegos indie y assets animados |
| `/galeria` | Explorar | Búsqueda y filtros por motor, estado y modelo 3D |
| `/proyecto/:id` | Detalle de proyecto | Visor 3D, ficha técnica, feedback con autor y "Solicitar unirme" |
| `/perfil` · `/perfil/:usuario` | Perfil | Tu perfil editable o el perfil público de otra cuenta; pestaña de solicitudes |
| `/publicar` | Publicar proyecto | Portada, modelo 3D con vista previa, motor, estado y enlace jugable |
| `/mensajes` | Mensajes | Chats privados en tiempo real entre cuentas |
| `/login` · `/registro` · `/recuperar` | Acceso | Inicio de sesión (correo o Google), registro con rol y recuperación de contraseña |
| `/creditos` | Acerca de & contacto | Manifiesto, equipo fundador y redes |

## Diseño adaptable

El sitio está construido **mobile first**:

- **Móvil (< 768 px):** menú hamburguesa, barra de navegación inferior (con avisos de mensajes y solicitudes) y carruseles horizontales.
- **Tablet (≥ 768 px):** la navegación pasa a la barra superior, desaparece la barra inferior y el contenido se redistribuye en columnas (filtros laterales en Explorar, perfil en dos columnas, lista de chats junto a la conversación).
- **Escritorio (≥ 1100 px):** rejillas más anchas, contenido centrado y panel con el perfil del contacto en Mensajes.

## Estructura

```
src/
├── auth/              # Sesión (AuthContext) y actividad en vivo: chats y solicitudes
├── servicios/         # Conexión con Firebase y Cloudinary (+ modo local de respaldo)
│   └── config.js      # Datos del proyecto de Firebase y de Cloudinary
├── components/
│   ├── layout/        # Header, SideMenu, BottomNav, Footer, Layout, AuthShell
│   └── ui/            # Button, InputField, SearchBar, Tag, Tabs, ProjectCard,
│                      # Avatar, Visor3D, RatingStars, Icon, PixelArt…
├── data/              # Proyectos de ejemplo y estado global
├── pages/             # Una carpeta por página (JSX + CSS)
├── index.css          # Variables de diseño (colores, tipografía, espaciado)
└── main.jsx           # Rutas con React Router (HashRouter)
firestore.rules        # Reglas de seguridad de la base de datos
FIREBASE.md            # Guía para configurar Firebase y Cloudinary
```

## Cómo correrlo

```bash
npm install
npm run dev
```

En Windows, si PowerShell bloquea `npm`, usa `npm.cmd install` y `npm.cmd run dev`.

## Tecnologías

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (HashRouter, compatible con GitHub Pages)
- [Firebase](https://firebase.google.com/) — Authentication y Cloud Firestore
- [Cloudinary](https://cloudinary.com/) — alojamiento de imágenes y modelos 3D
- [three.js](https://threejs.org/) — visor de modelos 3D
- CSS puro con variables y media queries
- GitHub Actions para el despliegue en GitHub Pages
- Fuentes: *Pixelify Sans*, *Cormorant SC* e *Inter* (Google Fonts)

## Equipo

Juan Sebastián López
Juan Pablo Hernández
