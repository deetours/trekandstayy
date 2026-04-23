'use client'

import { type MutableRefObject, useEffect, useRef } from 'react'
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core'

type InnerCompassProps = {
  progressRef?: MutableRefObject<number>
}

export default function InnerCompass({ progressRef }: InnerCompassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallbackProgressRef = useRef(0)
  const activeProgressRef = progressRef ?? fallbackProgressRef

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, antialias: true })
    const scene = new Scene(engine)
    scene.clearColor.set(0, 0, 0, 0)

    const camera = new ArcRotateCamera('compass-camera', Math.PI * 1.1, Math.PI * 0.48, 5.6, Vector3.Zero(), scene)
    camera.inputs.clear()

    const light = new HemisphericLight('compass-light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.66

    const root = new TransformNode('compass-root', scene)

    const ringMat = new StandardMaterial('compass-ring-mat', scene)
    ringMat.diffuseColor = new Color3(0.16, 0.26, 0.2)
    ringMat.emissiveColor = new Color3(0.02, 0.04, 0.032)
    ringMat.specularColor = new Color3(0.28, 0.22, 0.12)

    const needleMat = new StandardMaterial('compass-needle-mat', scene)
    needleMat.diffuseColor = new Color3(0.82, 0.68, 0.38)
    needleMat.emissiveColor = new Color3(0.22, 0.14, 0.04)
    needleMat.specularColor = new Color3(0.85, 0.72, 0.4)

    const ring = MeshBuilder.CreateTorus('inner-ring', { diameter: 2.55, thickness: 0.032, tessellation: 96 }, scene)
    ring.material = ringMat
    ring.parent = root
    ring.rotation.x = Math.PI * 0.5

    const inner = MeshBuilder.CreateTorus('inner-ring-small', { diameter: 1.34, thickness: 0.02, tessellation: 96 }, scene)
    inner.material = ringMat
    inner.parent = root
    inner.rotation.x = Math.PI * 0.5

    const needle = MeshBuilder.CreateCylinder('compass-needle', { height: 1.85, diameterTop: 0.035, diameterBottom: 0.11, tessellation: 4 }, scene)
    needle.material = needleMat
    needle.parent = root
    needle.rotation.z = Math.PI * 0.25
    needle.scaling.x = 0.42

    engine.runRenderLoop(() => {
      const progress = activeProgressRef.current
      const scrollGlow = Math.min(1, Math.max(0, progress))
      root.rotation.y += 0.003
      root.rotation.z = scrollGlow * 0.34
      needleMat.emissiveColor = new Color3(0.2 + scrollGlow * 0.42, 0.12 + scrollGlow * 0.28, 0.04)
      ringMat.emissiveColor = new Color3(0.02 + scrollGlow * 0.08, 0.04 + scrollGlow * 0.09, 0.032)
      light.intensity = 0.62 + scrollGlow * 0.62
      scene.render()
    })

    const resize = () => engine.resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      scene.dispose()
      engine.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="inner-compass-canvas" aria-hidden="true" />
}
