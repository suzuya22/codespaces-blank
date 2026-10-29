// Visor de modelos 3D (GLB, GLTF, OBJ, STL, FBX) con three.js
// - Arrastrar: girar · Rueda / pellizco: zoom · Clic derecho / dos dedos: mover
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import './Visor3D.css'

const MATERIAL_BASE = () => new THREE.MeshStandardMaterial({ color: 0xb9a6ff, roughness: 0.55, metalness: 0.1, side: THREE.DoubleSide }) // DoubleSide: muchos OBJ/STL traen caras invertidas

async function cargarModelo(url, formato) {
  switch (formato) {
    case 'glb':
    case 'gltf': {
      const gltf = await new GLTFLoader().loadAsync(url)
      return { objeto: gltf.scene, animaciones: gltf.animations }
    }
    case 'obj': {
      const objeto = await new OBJLoader().loadAsync(url)
      objeto.traverse((n) => n.isMesh && (n.material = MATERIAL_BASE()))
      return { objeto, animaciones: [] }
    }
    case 'stl': {
      const geometria = await new STLLoader().loadAsync(url)
      geometria.computeVertexNormals()
      return { objeto: new THREE.Mesh(geometria, MATERIAL_BASE()), animaciones: [] }
    }
    case 'fbx': {
      const objeto = await new FBXLoader().loadAsync(url)
      return { objeto, animaciones: objeto.animations ?? [] }
    }
    default:
      throw new Error('formato')
  }
}

export default function Visor3D({ url, formato, nombre = 'Modelo 3D', className = '' }) {
  const contenedorRef = useRef(null)
  const [estado, setEstado] = useState('cargando') // cargando | listo | error
  const [autoGiro, setAutoGiro] = useState(true)
  const controlesRef = useRef(null)
  const reiniciarRef = useRef(() => {})

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor || !url) return
    setEstado('cargando')
    let cancelado = false

    const escena = new THREE.Scene()
    const camara = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    contenedor.appendChild(renderer.domElement)

    escena.add(new THREE.HemisphereLight(0xffffff, 0x2a1f40, 1.6))
    const luz = new THREE.DirectionalLight(0xffffff, 2.2)
    luz.position.set(3, 5, 4)
    escena.add(luz)
    const contraluz = new THREE.DirectionalLight(0x8668e6, 1.2)
    contraluz.position.set(-4, 2, -3)
    escena.add(contraluz)

    const piso = new THREE.GridHelper(10, 20, 0x5a3fb0, 0x2a2140)
    escena.add(piso)

    const controles = new OrbitControls(camara, renderer.domElement)
    controles.enableDamping = true
    controles.autoRotate = true
    controles.autoRotateSpeed = 1.2
    controlesRef.current = controles

    let mezclador = null
    const reloj = new THREE.Clock()

    const ajustarTamano = () => {
      const { clientWidth: w, clientHeight: h } = contenedor
      if (!w || !h) return
      renderer.setSize(w, h)
      camara.aspect = w / h
      camara.updateProjectionMatrix()
    }
    const observador = new ResizeObserver(ajustarTamano)
    observador.observe(contenedor)
    ajustarTamano()

    renderer.setAnimationLoop(() => {
      if (mezclador) mezclador.update(reloj.getDelta())
      controles.update()
      renderer.render(escena, camara)
    })

    cargarModelo(url, formato)
      .then(({ objeto, animaciones }) => {
        if (cancelado) return
        // Centrar el modelo y encuadrar la cámara según su tamaño
        const caja = new THREE.Box3().setFromObject(objeto)
        const tamano = caja.getSize(new THREE.Vector3())
        const centro = caja.getCenter(new THREE.Vector3())
        const maximo = Math.max(tamano.x, tamano.y, tamano.z) || 1
        const escala = 2 / maximo
        objeto.scale.setScalar(escala)
        objeto.position.set(-centro.x * escala, -caja.min.y * escala, -centro.z * escala)
        escena.add(objeto)
        piso.scale.setScalar(0.5)

        const encuadrar = () => {
          camara.position.set(3.6, 2.7, 4.2)
          controles.target.set(0, (tamano.y * escala) / 2, 0)
          controles.update()
        }
        reiniciarRef.current = encuadrar
        encuadrar()

        if (animaciones?.length) {
          mezclador = new THREE.AnimationMixer(objeto)
          mezclador.clipAction(animaciones[0]).play()
        }
        setEstado('listo')
      })
      .catch(() => !cancelado && setEstado('error'))

    return () => {
      cancelado = true
      observador.disconnect()
      renderer.setAnimationLoop(null)
      controles.dispose()
      escena.traverse((n) => {
        n.geometry?.dispose?.()
        const mats = Array.isArray(n.material) ? n.material : n.material ? [n.material] : []
        mats.forEach((m) => {
          Object.values(m).forEach((v) => v?.isTexture && v.dispose())
          m.dispose()
        })
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [url, formato])

  useEffect(() => {
    if (controlesRef.current) controlesRef.current.autoRotate = autoGiro
  }, [autoGiro])

  return (
    <div className={`visor3d ${className}`}>
      <div ref={contenedorRef} className="visor3d__lienzo" role="img" aria-label={`Vista 3D interactiva: ${nombre}`} />
      {estado === 'cargando' && <p className="visor3d__estado">Cargando modelo 3D…</p>}
      {estado === 'error' && (
        <p className="visor3d__estado visor3d__estado--error">
          No se pudo cargar el modelo. Si es GLTF con archivos externos, súbelo como GLB.
        </p>
      )}
      {estado === 'listo' && (
        <div className="visor3d__controles">
          <button type="button" onClick={() => setAutoGiro(!autoGiro)}>
            {autoGiro ? '⏸ Pausar giro' : '⟳ Girar'}
          </button>
          <button type="button" onClick={() => reiniciarRef.current()}>
            ⌖ Centrar
          </button>
        </div>
      )}
      <span className="visor3d__ayuda">Arrastra para girar · rueda o pellizco para zoom</span>
    </div>
  )
}
