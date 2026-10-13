import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header.jsx'
import SideMenu from './SideMenu.jsx'
import BottomNav from './BottomNav.jsx'
import Footer from './Footer.jsx'
import './Layout.css'

// Estructura común de todas las páginas
export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { pathname } = useLocation()
  const cerrar = useCallback(() => setMenuAbierto(false), [])

  // Al cambiar de página, volver arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="layout">
      {/* Con HashRouter no se puede usar href="#id", por eso el salto se hace con foco */}
      <button type="button" className="layout__skip" onClick={() => document.getElementById('contenido')?.focus()}>
        Saltar al contenido
      </button>
      <Header onMenu={() => setMenuAbierto(true)} />
      <SideMenu open={menuAbierto} onClose={cerrar} />
      <main id="contenido" className="layout__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
