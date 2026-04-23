'use client'

import { useEffect, useRef, useState } from 'react'
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

type CompassRuntime = {
  engine: Engine
  scene: Scene
}

export default function TerrainCompassShard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<CompassRuntime | null>(null)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!canvas || prefersReducedMotion) {
      setShowFallback(true)
      return
    }

    let disposed = false
    let isVisible = true

    try {
      const engine = new Engine(canvas, true, {
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
      const scene = new Scene(engine)
      scene.clearColor.set(0, 0, 0, 0)
      runtimeRef.current = { engine, scene }

      const camera = new ArcRotateCamera('terrain-camera', Math.PI / 2.25, Math.PI / 2.7, 5.9, Vector3.Zero(), scene)
      camera.inputs.clear()

      const light = new HemisphericLight('terrain-light', new Vector3(-0.4, 0.9, 0.35), scene)
      light.intensity = 1.12
      light.groundColor = new Color3(0.05, 0.13, 0.09)

      const root = new TransformNode('terrain-compass-root', scene)

      const stone = new StandardMaterial('matte-stone', scene)
      stone.diffuseColor = new Color3(0.07, 0.16, 0.12)
      stone.specularColor = new Color3(0.04, 0.035, 0.025)
      stone.emissiveColor = new Color3(0.005, 0.012, 0.009)

      const bronze = new StandardMaterial('trail-bronze', scene)
      bronze.diffuseColor = new Color3(0.55, 0.43, 0.22)
      bronze.specularColor = new Color3(0.12, 0.09, 0.04)
      bronze.emissiveColor = new Color3(0.08, 0.055, 0.025)

      const signal = new StandardMaterial('route-signal', scene)
      signal.diffuseColor = new Color3(0.81, 0.68, 0.42)
      signal.emissiveColor = new Color3(0.17, 0.11, 0.04)
      signal.alpha = 0.32

      const shard = MeshBuilder.CreateCylinder(
        'terrain-shard',
        {
          height: 0.16,
          diameterTop: 2.56,
          diameterBottom: 2.84,
          tessellation: 7,
        },
        scene,
      )
      shard.material = stone
      shard.parent = root
      shard.rotation.x = Math.PI / 2
      shard.scaling = new Vector3(1, 1.34, 1)

      const ridge = MeshBuilder.CreateTorus(
        'compass-ridge',
        {
          diameter: 2.46,
          thickness: 0.018,
          tessellation: 72,
        },
        scene,
      )
      ridge.material = bronze
      ridge.parent = root
      ridge.rotation.x = Math.PI / 2
      ridge.scaling = new Vector3(0.82, 1.06, 1)

      const notch = MeshBuilder.CreateBox('north-notch', { width: 0.08, height: 0.5, depth: 0.024 }, scene)
      notch.material = bronze
      notch.parent = root
      notch.position.y = 1.42
      notch.rotation.z = -0.12

      const routePoints = [
        new Vector3(-0.82, -0.38, 0.12),
        new Vector3(-0.42, 0.12, 0.14),
        new Vector3(0.06, -0.02, 0.13),
        new Vector3(0.46, 0.42, 0.15),
        new Vector3(0.88, 0.25, 0.14),
      ]

      const route = MeshBuilder.CreateTube(
        'drawn-route',
        {
          path: routePoints,
          radius: 0.014,
          tessellation: 12,
        },
        scene,
      )
      route.material = signal
      route.parent = root

      const marker = MeshBuilder.CreateSphere('route-marker', { diameter: 0.09, segments: 12 }, scene)
      marker.material = bronze
      marker.parent = root
      marker.position = routePoints[routePoints.length - 1]

      root.rotation.x = -0.42
      root.rotation.z = -0.18

      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting
        },
        { threshold: 0.08 },
      )
      observer.observe(canvas)

      const resize = () => {
        engine.resize()
      }

      window.addEventListener('resize', resize, { passive: true })

      engine.runRenderLoop(() => {
        if (disposed || !isVisible) return

        const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollMax))

        root.rotation.y += 0.0025
        root.rotation.x = -0.42 + progress * 0.38
        root.rotation.z = -0.18 + progress * 0.24
        route.scaling.x = 0.42 + progress * 0.58
        signal.alpha = 0.18 + progress * 0.42
        marker.position.x = routePoints[2].x + (routePoints[4].x - routePoints[2].x) * progress
        marker.position.y = routePoints[2].y + (routePoints[4].y - routePoints[2].y) * progress

        scene.render()
      })

      return () => {
        disposed = true
        observer.disconnect()
        window.removeEventListener('resize', resize)
        scene.dispose()
        engine.dispose()
        runtimeRef.current = null
      }
    } catch {
      setShowFallback(true)
    }
  }, [])

  return (
    <div className="terrain-compass" aria-hidden="true">
      {showFallback ? <TerrainCompassFallback /> : null}
      <canvas ref={canvasRef} className="terrain-compass-canvas" tabIndex={-1} />
    </div>
  )
}

function TerrainCompassFallback() {
  return (
    <svg className="terrain-compass-fallback" viewBox="0 0 220 220" role="img" aria-label="">
      <path
        d="M111 17 190 73 174 164 94 202 31 137 50 52Z"
        fill="rgba(15,46,35,0.42)"
        stroke="rgba(207,175,107,0.52)"
      />
      <path d="M52 138 C 78 86, 103 134, 128 96 S 169 74, 178 104" fill="none" stroke="rgba(207,175,107,0.72)" />
      <path d="M110 40 121 92 98 94Z" fill="rgba(207,175,107,0.5)" />
    </svg>
  )
}
