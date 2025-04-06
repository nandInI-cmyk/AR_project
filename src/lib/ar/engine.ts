import * as THREE from 'three';
import { ARInitOptions, GuitarFretboardMarker } from '@/types/ar';

// Guitar string frequencies (standard tuning: E2, A2, D3, G3, B3, E4)
const STRING_FREQUENCIES = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

// Fretboard dimensions (in mm)
const FRETBOARD_WIDTH = 43; // mm at nut
const FRETBOARD_LENGTH = 650; // mm (scale length)

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
];

export function initializeAR(options: ARInitOptions) {
  const { container, video, canvas, onInitialized, onError } = options;

  try {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    // Initialize AR.js
    const arToolkitSource = new (window as any).THREEx.ArToolkitSource({
      sourceType: 'webcam',
      sourceWidth: container.offsetWidth,
      sourceHeight: container.offsetHeight,
    });

    arToolkitSource.init(() => {
      setTimeout(() => {
        onResize();
      }, 2000);
    });

    // Handle resize
    const onResize = () => {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    };

    window.addEventListener('resize', onResize);

    // Initialize AR context
    const arToolkitContext = new (window as any).THREEx.ArToolkitContext({
      cameraParametersUrl: '/camera_para.dat',
      detectionMode: 'mono',
      maxDetectionRate: 30,
      canvasWidth: container.offsetWidth,
      canvasHeight: container.offsetHeight,
    });

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
      onInitialized();
    });

    // Create marker controls for each marker
    MARKERS.forEach((marker) => {
      const markerRoot = new THREE.Group();
      scene.add(markerRoot);

      const markerControls = new (window as any).THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: 'pattern',
        patternUrl: `/markers/${marker.id}.patt`,
      });

      // Create visual representation of the marker
      const markerGeometry = new THREE.PlaneGeometry(marker.width, marker.height);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
      });
      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
      markerMesh.rotation.x = -Math.PI / 2;
      markerRoot.add(markerMesh);
    });

    // Create fretboard visualization
    const createFretboard = () => {
      const fretboardGroup = new THREE.Group();

      // Create strings
      for (let i = 0; i < 6; i++) {
        const stringGeometry = new THREE.CylinderGeometry(0.5, 0.5, FRETBOARD_LENGTH, 8);
        const stringMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);

        string.position.x = (i - 2.5) * (FRETBOARD_WIDTH / 5);
        string.position.y = 2;
        string.rotation.x = Math.PI / 2;

        fretboardGroup.add(string);
      }

      // Create frets
      const numFrets = 12;
      for (let i = 0; i <= numFrets; i++) {
        const fretPosition = (FRETBOARD_LENGTH * (1 - Math.pow(2, -i / 12))) / 2;

        const fretGeometry = new THREE.BoxGeometry(FRETBOARD_WIDTH + 5, 1, 2);
        const fretMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const fret = new THREE.Mesh(fretGeometry, fretMaterial);

        fret.position.z = -fretPosition;
        fret.position.y = 1;

        fretboardGroup.add(fret);
      }

      return fretboardGroup;
    };

    const fretboard = createFretboard();
    scene.add(fretboard);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
        scene.visible = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return {
      scene,
      camera,
      renderer,
      arToolkitContext,
      arToolkitSource,
    };
  } catch (error) {
    onError(error as Error);
    return null;
  }
}