'use client';

import React, { useEffect, useRef, useState } from 'react';
import { initializeAR } from '@/lib/ar/engine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ARGuitarLearning() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartCamera = async () => {
    try {
      setPermissionError(null);

      // Check if permissions were already denied
      const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });

      if (permissionStatus.state === "denied") {
        setPermissionError(
          "Camera permission was previously denied. Please reset permissions in your browser settings."
        );
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment", // Prefer back camera if available
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setCameraActive(true);
                initARProcessing();
                toast({
                  title: "Camera started",
                  description: "AR guitar detection is now active",
                });
              })
              .catch((err) => {
                console.error("Error playing video:", err);
                setPermissionError(`Error playing video: ${err.message}`);
              });
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setPermissionError("Camera access was denied. Please allow camera access to use the AR features.");
        } else if (error.name === "NotFoundError") {
          setPermissionError("No camera found. Please connect a camera and try again.");
        } else if (error.name === "NotReadableError") {
          setPermissionError("Camera is already in use by another application.");
        } else {
          setPermissionError(`Camera error: ${error.message}`);
        }
      } else {
        setPermissionError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const initARProcessing = () => {
    if (!containerRef.current || !videoRef.current || !canvasRef.current) return;

    initializeAR({
      container: containerRef.current,
      video: videoRef.current,
      canvas: canvasRef.current,
      onInitialized: () => {
        console.log("AR initialized successfully");
      },
      onError: (error) => {
        console.error("AR initialization error:", error);
        setPermissionError(`AR initialization error: ${error.message}`);
      },
    });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">AR Guitar Learning</h1>

      {permissionError && (
        <Alert variant="destructive">
          <AlertTitle>Camera Permission Error</AlertTitle>
          <AlertDescription>
            {permissionError}
            {permissionError.includes("denied") && (
              <div className="mt-2">
                <p className="font-semibold">How to fix:</p>
                <ol className="list-decimal pl-5 mt-1 text-sm">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera access</li>
                  <li>Refresh the page and try again</li>
                </ol>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {!cameraActive && !permissionError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <div className="text-center p-4">
                <Camera className="mx-auto h-12 w-12 mb-2" />
                <p>Click "Start Camera" to begin</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        {!cameraActive ? (
          <Button onClick={handleStartCamera} className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <Button onClick={stopCamera} variant="destructive" className="flex items-center gap-2">
            Stop Camera
          </Button>
        )}

        {permissionError && (
          <Button onClick={() => window.location.reload()} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        )}
      </div>

      {cameraActive && (
        <div className="text-center text-sm text-muted-foreground">
          Point your camera at a guitar fretboard to begin detection
        </div>
      )}
    </div>
  );
}
