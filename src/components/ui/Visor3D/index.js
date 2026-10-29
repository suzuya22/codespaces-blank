// three.js pesa bastante: el visor se descarga solo cuando una página lo necesita
import { lazy } from 'react'

export const Visor3D = lazy(() => import('./Visor3D.jsx'))
