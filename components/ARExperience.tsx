"use client"

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

interface SongData {
  markerId: string;
  audioUrl: string;
  fingerPositions: {
    time: number;
    position: { x: number; y: number; z: number };
    finger: number;
  }[];
}

interface ARExperienceProps {
  songs: SongData[];
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

const ARExperience = ({ songs, onPlaybackStateChange }: ARExperienceProps) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldPlay, setShouldPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const arToolkitContextRef = useRef<any>(null);
  const arToolkitSourceRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef3D = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Handle explicit play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else if (currentSong) {
      setShouldPlay(true);
      playSong(currentSong);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const initAR = async () => {
      if (!sceneRef.current || !mountedRef.current) return;

      try {
        // Import AR.js dynamically
        const ARjs = await import('@ar-js-org/ar.js');
        
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        sceneRef3D.current = scene;
        
        const camera = new THREE.Camera();
        cameraRef.current = camera;
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (sceneRef.current) {
          sceneRef.current.appendChild(renderer.domElement);
        }

        // Create a video element for the webcam
        const video = document.createElement('video');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.zIndex = '-1';
        
        // Get webcam stream
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          video.srcObject = stream;
          video.play();
          
          // Add video to the scene
          if (sceneRef.current) {
            sceneRef.current.appendChild(video);
          }
          
          // Create a canvas for AR processing
          const canvas = document.createElement('canvas');
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.zIndex = '0';
          
          if (sceneRef.current) {
            sceneRef.current.appendChild(canvas);
          }
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          // Set canvas size to match video
          const updateCanvasSize = () => {
            if (video.videoWidth && video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }
          };
          
          video.addEventListener('loadedmetadata', updateCanvasSize);
          updateCanvasSize();
          
          // Create markers for each song
          songs.forEach((song) => {
            try {
              const markerRoot = new THREE.Group();
              scene.add(markerRoot);
              
              // Add visual feedback when marker is detected
              const geometry = new THREE.BoxGeometry(1, 1, 1);
              const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
              const cube = new THREE.Mesh(geometry, material);
              markerRoot.add(cube);
              
              // Simple marker detection using image processing
              const detectMarker = () => {
                if (!ctx || !video.videoWidth || !video.videoHeight) return;
                
                // Draw video frame to canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Get image data for processing
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Use a simpler, more reliable approach for marker detection
                const markerDetected = detectSimpleMarker(imageData, song.markerId);
                
                if (markerDetected) {
                  if (!mountedRef.current) return;
                  console.log('Marker found:', song.markerId);
                  setCurrentSong(song);
                  // Don't autoplay on marker detection
                } else {
                  if (isPlaying) {
                    pauseSong();
                  }
                }
              };
              
              // Start detection loop
              const detectionInterval = setInterval(detectMarker, 100);
              
              // Clean up interval on unmount
              return () => {
                clearInterval(detectionInterval);
              };
            } catch (error) {
              console.error('Error setting up marker:', song.markerId, error);
            }
          });
          
          // Simple marker detection function that looks for high contrast regions
          const detectSimpleMarker = (imageData: ImageData, markerId: string) => {
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            
            // For demonstration purposes, we'll use a simple approach:
            // 1. Divide the image into a grid
            // 2. Calculate the average brightness of each grid cell
            // 3. Look for cells with high contrast (very dark or very bright)
            
            const gridSize = 8; // 8x8 grid
            const cellWidth = Math.floor(width / gridSize);
            const cellHeight = Math.floor(height / gridSize);
            
            // Create a grid to store average brightness values
            const grid: number[][] = [];
            for (let y = 0; y < gridSize; y++) {
              grid[y] = [];
              for (let x = 0; x < gridSize; x++) {
                grid[y][x] = 0;
              }
            }
            
            // Calculate average brightness for each grid cell
            for (let y = 0; y < height; y++) {
              const gridY = Math.floor(y / cellHeight);
              for (let x = 0; x < width; x++) {
                const gridX = Math.floor(x / cellWidth);
                
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Calculate brightness (simple average)
                const brightness = (r + g + b) / 3;
                
                // Add to the grid cell
                grid[gridY][gridX] += brightness;
              }
            }
            
            // Calculate average brightness for each grid cell
            for (let y = 0; y < gridSize; y++) {
              for (let x = 0; x < gridSize; x++) {
                grid[y][x] /= (cellWidth * cellHeight);
              }
            }
            
            // Find the darkest and brightest cells
            let minBrightness = 255;
            let maxBrightness = 0;
            
            for (let y = 0; y < gridSize; y++) {
              for (let x = 0; x < gridSize; x++) {
                minBrightness = Math.min(minBrightness, grid[y][x]);
                maxBrightness = Math.max(maxBrightness, grid[y][x]);
              }
            }
            
            // Calculate contrast
            const contrast = maxBrightness - minBrightness;
            
            // Debug output
            console.log(`Marker ${markerId}: Contrast: ${contrast.toFixed(2)}, Min: ${minBrightness.toFixed(2)}, Max: ${maxBrightness.toFixed(2)}`);
            
            // Check if there's enough contrast to indicate a marker
            // This threshold may need adjustment based on your specific markers
            const contrastThreshold = 100;
            
            // For demonstration, we'll consider it a marker if there's high contrast
            // In a real app, you would use a more sophisticated approach
            return contrast > contrastThreshold;
          };
          
          // Animation loop
          const animate = () => {
            if (!mountedRef.current) return;
            requestAnimationFrame(animate);
            
            if (renderer && scene && camera) {
              try {
                // Render the scene
                renderer.render(scene, camera);
              } catch (error) {
                console.error('Error in animation loop:', error);
              }
            }
          };
          animate();
          
          // Handle window resize
          const handleResize = () => {
            if (renderer && sceneRef.current) {
              renderer.setSize(window.innerWidth, window.innerHeight);
            }
            updateCanvasSize();
          };
          window.addEventListener('resize', handleResize);
          
          setIsLoading(false);
          
          return () => {
            window.removeEventListener('resize', handleResize);
            if (sceneRef.current && renderer.domElement) {
              sceneRef.current.removeChild(renderer.domElement);
            }
            if (sceneRef.current && video) {
              sceneRef.current.removeChild(video);
            }
            if (sceneRef.current && canvas) {
              sceneRef.current.removeChild(canvas);
            }
            if (audioRef.current) {
              audioRef.current.pause();
            }
            // Stop all tracks
            if (video.srcObject) {
              const tracks = (video.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
            }
          };
        } catch (error) {
          console.error('Error accessing camera:', error);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing AR:', error);
        setIsLoading(false);
      }
    };

    initAR();

    return () => {
      mountedRef.current = false;
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [songs]);

  const playSong = (song: SongData) => {
    try {
      // If there's already an audio element playing, pause it first
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create a new audio element
      const audio = new Audio(song.audioUrl);
      audioRef.current = audio;
      
      // Set up error handling
      audio.onerror = (e) => {
        console.error('Error playing audio:', e);
        setIsPlaying(false);
        onPlaybackStateChange?.(false);
      };
      
      // Only play if explicitly requested
      if (shouldPlay) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (!mountedRef.current) return;
              setIsPlaying(true);
              onPlaybackStateChange?.(true);
            })
            .catch(error => {
              console.error('Error playing audio:', error);
              if (!mountedRef.current) return;
              setIsPlaying(false);
              onPlaybackStateChange?.(false);
            });
        }
      }
    } catch (error) {
      console.error('Error in playSong:', error);
      setIsPlaying(false);
      onPlaybackStateChange?.(false);
    }
  };

  const pauseSong = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setShouldPlay(false);
      onPlaybackStateChange?.(false);
    } catch (error) {
      console.error('Error in pauseSong:', error);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={sceneRef} className="absolute inset-0" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-white text-lg">Loading AR experience...</p>
        </div>
      )}
      {currentSong && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-4 rounded-lg">
          <h3 className="text-white text-lg font-bold">{currentSong.markerId}</h3>
          <p className="text-white">{isPlaying ? 'Playing' : 'Paused'}</p>
          <button 
            onClick={handlePlayPause}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(ARExperience), {
  ssr: false
}); 