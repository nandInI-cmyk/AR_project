"use client"

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FingerPosition {
  time: number;
  position: { x: number; y: number; z: number };
  finger: number;
}

interface FingerPositionOverlayProps {
  positions: FingerPosition[];
  currentTime: number;
}

export default function FingerPositionOverlay({ positions, currentTime }: FingerPositionOverlayProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const fingerMeshesRef = useRef<THREE.Mesh[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef3D = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    try {
      const scene = new THREE.Scene();
      sceneRef3D.current = scene;
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      cameraRef.current = camera;
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      rendererRef.current = renderer;
      renderer.setSize(window.innerWidth, window.innerHeight);
      sceneRef.current.appendChild(renderer.domElement);

      // Create finger meshes
      const fingerColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
      fingerMeshesRef.current = fingerColors.map((color) => {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false; // Start with invisible fingers
        scene.add(mesh);
        return mesh;
      });

      // Handle window resize
      const handleResize = () => {
        if (renderer && camera && sceneRef.current) {
          const width = window.innerWidth;
          const height = window.innerHeight;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      };
      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        try {
          // Update finger positions based on current time
          positions.forEach((pos) => {
            if (Math.abs(currentTime - pos.time) < 100) { // Within 100ms of the target time
              const mesh = fingerMeshesRef.current[pos.finger];
              if (mesh) {
                mesh.position.set(pos.position.x, pos.position.y, pos.position.z);
                mesh.visible = true;
              }
            }
          });

          // Hide fingers that don't have a position near the current time
          fingerMeshesRef.current.forEach((mesh, index) => {
            const hasPosition = positions.some(pos => 
              Math.abs(currentTime - pos.time) < 100 && pos.finger === index
            );
            if (!hasPosition) {
              mesh.visible = false;
            }
          });

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        } catch (error) {
          console.error('Error in animation loop:', error);
        }
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (sceneRef.current && renderer.domElement) {
          sceneRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.error('Error initializing finger position overlay:', error);
    }
  }, [positions, currentTime]);

  return <div ref={sceneRef} className="absolute inset-0 pointer-events-none" />;
} 