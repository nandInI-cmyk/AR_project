import * as THREE from "three"
import * as THREEx from "@ar-js-org/ar.js"

type ARInitOptions = {
  container: HTMLDivElement
  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  onInitialized: () => void
  onError: (error: Error) => void
}

type GuitarFretboardMarker = {
  id: string
  position: THREE.Vector3
  rotation: THREE.Euler
  width: number
  height: number
}

type FingerPosition = {
  string: number
  fret: number
  finger: number
  position: THREE.Vector3
}

// Guitar string frequencies (standard tuning: E2, A2, D3, G3, B3, E4)
const STRING_FREQUENCIES = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63]

// Fretboard dimensions (in mm)
const FRETBOARD_WIDTH = 43 // mm at nut
const FRETBOARD_LENGTH = 650 // mm (scale length)

// Marker definitions
const MARKERS: GuitarFretboardMarker[] = [
  {
    id: "guitar-head",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    width: 80,
    height: 150,
  },
  {
    id: "fret-marker-5",
    position: new THREE.Vector3(0, -200, 0),
    rotation: new THREE.Euler(0, 0, 0),
    width: 50,
    height: 50,
  },
  {
    id: "fret-marker-12",
    position: new THREE.Vector3(0, -400, 0),
    rotation: new THREE.Euler(0, 0, 0),
    width: 50,
    height: 50,
  },
]

export function initializeAR(options: ARInitOptions) {
  const { container, video, canvas, onInitialized, onError } = options

  try {
    // Initialize Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)

    // Initialize AR.js
    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: "webcam",
      sourceWidth: container.clientWidth,
      sourceHeight: container.clientHeight,
      displayWidth: container.clientWidth,
      displayHeight: container.clientHeight,
    })

    arToolkitSource.init(() => {
      setTimeout(() => {
        onResize()
      }, 200)
    })

    // Handle window resize
    const onResize = () => {
      arToolkitSource.onResizeElement()
      arToolkitSource.copyElementSizeTo(renderer.domElement)
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
      }
    }

    window.addEventListener("resize", onResize)

    // Initialize AR context
    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: "/camera_para.dat",
      detectionMode: "mono",
      maxDetectionRate: 30,
      canvasWidth: container.clientWidth,
      canvasHeight: container.clientHeight,
    })

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
    })

    // Create marker controls for each marker
    MARKERS.forEach((marker) => {
      const markerRoot = new THREE.Group()
      scene.add(markerRoot)

      const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: `/markers/${marker.id}.patt`,
      })

      // Create visual representation of the marker
      const markerGeometry = new THREE.PlaneGeometry(marker.width, marker.height)
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
      })
      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial)
      markerMesh.rotation.x = -Math.PI / 2
      markerRoot.add(markerMesh)
    })

    // Create fretboard visualization
    const createFretboard = () => {
      const fretboardGroup = new THREE.Group()

      // Create strings
      for (let i = 0; i < 6; i++) {
        const stringGeometry = new THREE.CylinderGeometry(0.5, 0.5, FRETBOARD_LENGTH, 8)
        const stringMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
        const string = new THREE.Mesh(stringGeometry, stringMaterial)

        string.position.x = (i - 2.5) * (FRETBOARD_WIDTH / 5)
        string.position.y = 2
        string.rotation.x = Math.PI / 2

        fretboardGroup.add(string)
      }

      // Create frets
      const numFrets = 12
      for (let i = 0; i <= numFrets; i++) {
        const fretPosition = (FRETBOARD_LENGTH * (1 - Math.pow(2, -i / 12))) / 2

        const fretGeometry = new THREE.BoxGeometry(FRETBOARD_WIDTH + 5, 1, 2)
        const fretMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 })
        const fret = new THREE.Mesh(fretGeometry, fretMaterial)

        fret.position.z = -fretPosition
        fret.position.y = 1

        fretboardGroup.add(fret)
      }

      return fretboardGroup
    }

    const fretboard = createFretboard()
    scene.add(fretboard)

    // Create finger position indicators
    const fingerPositions: FingerPosition[] = []

    const updateFingerPositions = (positions: FingerPosition[]) => {
      // Remove existing finger indicators
      fingerPositions.forEach((pos) => {
        scene.remove(pos as unknown as THREE.Object3D)
      })

      // Create new finger indicators
      positions.forEach((pos) => {
        const fingerGeometry = new THREE.SphereGeometry(5, 32, 32)
        const fingerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const fingerMesh = new THREE.Mesh(fingerGeometry, fingerMaterial)

        fingerMesh.position.copy(pos.position)
        scene.add(fingerMesh)

        // Add to tracking array
        fingerPositions.push({
          ...pos,
          position: fingerMesh.position,
        })
      })
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement)
      }

      renderer.render(scene, camera)
    }

    animate()
    onInitialized()

    // Return cleanup function
    return () => {
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      // Additional cleanup as needed
    }
  } catch (error) {
    onError(error as Error)
    return () => {}
  }
}

