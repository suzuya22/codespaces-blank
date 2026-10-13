# 🎮 DevNet — Comunidad indie

> **Donde el desarrollo indie cobra vida.**
> Comparte prototipos, recibe feedback real y encuentra tu equipo.

DevNet es una plataforma web para creadores de videojuegos independientes: programadores, artistas, animadores, compositores y game designers pueden publicar sus prototipos, pedir playtesting y armar equipos de trabajo.

Proyecto del curso **Diseño adaptable** — Universidad Pontificia Bolivariana, 2026-2.

🔗 **Sitio publicado:** https://suzuya22.github.io/codespaces-blank/

---

## 📌 Entrega #2

- Diseño en borrador y wireframe digital de la **versión tablet**.
- Diseño en alta de la **versión móvil** en Figma.
- Primera versión del sitio en **React**, con secciones, componentes y navegación.
- Publicación en **GitHub Pages**.

## 🧭 Secciones del sitio

| Ruta | Sección | Descripción |
| --- | --- | --- |
| `/` | Inicio | Destacados / Nuevo, buscador, videojuegos indie y assets animados |
| `/galeria` | Explorar | Búsqueda y filtros por motor y estado del proyecto |
| `/proyecto/:id` | Detalle de proyecto | Ficha técnica, evaluación con estrellas, feedback y "Solicitar unirme" |
| `/perfil/:usuario` | Perfil | Insignias, sobre mí, habilidades y proyectos publicados |
| `/publicar` | Publicar proyecto | Formulario con vista previa de portada y subida de build |
| `/mensajes` | Mensajes | Chat entre creadores |
| `/login` · `/registro` · `/recuperar` | Acceso | Inicio de sesión, registro con rol principal y recuperación de contraseña |
| `/creditos` | Acerca de & contacto | Manifiesto, equipo fundador y redes |

## 📱 Diseño adaptable

El sitio está construido **mobile first**:

- **Móvil (< 768 px):** menú hamburguesa, barra de navegación inferior y carruseles horizontales.
- **Tablet (≥ 768 px):** la navegación pasa a la barra superior, desaparece la barra inferior y el contenido se redistribuye en columnas (filtros laterales en Explorar, perfil en dos columnas, lista de chats con nombres, formularios de acceso junto al banner).
- **Escritorio (≥ 1100 px):** rejillas más anchas y contenido centrado.

## 🧩 Estructura

```
src/
├── components/
│   ├── layout/        # Header, SideMenu, BottomNav, Footer, Layout, AuthShell
│   └── ui/            # Button, InputField, SearchBar, Tag, Tabs, ProjectCard,
│                      # SectionHeader, HeroBanner, ChatBubble, RatingStars,
│                      # Icon y PixelArt (portadas, avatares y cielo pixelado)
├── data/              # Contenido de ejemplo (proyectos, usuarios, chats)
├── pages/             # Una carpeta por página (JSX + CSS)
├── index.css          # Variables de diseño (colores, tipografía, espaciado)
└── main.jsx           # Rutas con React Router (HashRouter)
```

Las imágenes de proyectos y avatares son **arte pixelado generado por código**, por lo que el sitio no usa imágenes con derechos de autor.

## 🛠️ Tecnologías

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (HashRouter, compatible con GitHub Pages)
- CSS puro con variables y media queries
- GitHub Actions para el despliegue en GitHub Pages
- Fuentes: *Pixelify Sans*, *Cormorant SC* e *Inter* (Google Fonts)

## 🚀 Cómo ejecutarlo

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # compilar a /dist
npm run preview  # ver la versión compilada
```

Cada `push` a `main` publica el sitio automáticamente con el workflow `.github/workflows/deploy.yml`.

## 👥 Equipo

| Integrante | Rol |
| --- | --- |
| Juan Sebastián López | Lead Game Dev & UX Architect |
| Juan Pablo Hernández | Lead UI/UX & Art Director |
