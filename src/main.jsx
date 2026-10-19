import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'

import Layout from './components/layout/Layout.jsx'
import Home from './pages/home/Home.jsx'
import Galeria from './pages/galeria/Galeria.jsx'
import Proyecto from './pages/proyecto/Proyecto.jsx'
import Perfil from './pages/perfil/Perfil.jsx'
import Publicar from './pages/publicar/Publicar.jsx'
import Mensajes from './pages/mensajes/Mensajes.jsx'
import Login from './pages/login/Login.jsx'
import Registro from './pages/registro/Registro.jsx'
import Recuperar from './pages/recuperar/Recuperar.jsx'
import Creditos from './pages/creditos/Creditos.jsx'

// HashRouter: las rutas quedan como /#/galeria, lo que funciona en GitHub Pages sin configuración extra
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/proyecto/:id" element={<Proyecto />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/:usuario" element={<Perfil />} />
          <Route path="/publicar" element={<Publicar />} />
          <Route path="/mensajes" element={<Mensajes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/creditos" element={<Creditos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
