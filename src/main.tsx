import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,Routes, Route } from "react-router";
import './index.css'
import Creditos from "./pages/creditos/Creditos.jsx"
import Galeria from "./pages/galeria/Galeria.jsx"
import Home from './pages/home/Home.jsx'
import Registro from './pages/registro/Registro.jsx'
import Menu from "./components/ui/menu/Menu.jsx"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Menu />
    <Routes>
      <Route path="/creditos" element={<Creditos />} />
      <Route path="/galeria" element={<Galeria />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>,
)
