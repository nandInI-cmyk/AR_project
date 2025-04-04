"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Camera, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ARExperience from "@/components/ARExperience"

export default function ARGuitarLearning() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleStartCamera = async () => {
    try {
      // Reset any previous errors
      setPermissionError(null)

      // Check if permissions were already denied
      const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName })

      if (permissionStatus.state === "denied") {
        setPermissionError(
          "Camera permission was previously denied. Please reset permissions in your browser settings.",
        )
        return
      }

      // Request camera access with constraints for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment", // Prefer back camera if available
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Ensure video plays continuously
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setCameraActive(true)
                initARProcessing()
                toast({
                  title: "Camera started",
                  description: "AR guitar detection is now active",
                })
              })
              .catch((err) => {
                console.error("Error playing video:", err)
                setPermissionError(`Error playing video: ${err.message}`)
              })
          }
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)

      // Handle specific error types
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setPermissionError("Camera access was denied. Please allow camera access to use the AR features.")
        } else if (error.name === "NotFoundError") {
          setPermissionError("No camera found. Please connect a camera and try again.")
        } else if (error.name === "NotReadableError") {
          setPermissionError("Camera is already in use by another application.")
        } else {
          setPermissionError(`Camera error: ${error.message}`)
        }
      } else {
        setPermissionError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }

    // Cancel animation frame if active
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  const initARProcessing = () => {
    // This function will be called after camera is successfully started
    // Here you would initialize your AR processing, marker detection, etc.
    console.log("AR processing initialized")

    const updateCanvas = () => {
      if (canvasRef.current && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          // Match canvas size to video
          const width = videoRef.current.videoWidth
          const height = videoRef.current.videoHeight

          if (canvasRef.current.width !== width || canvasRef.current.height !== height) {
            canvasRef.current.width = width
            canvasRef.current.height = height
          }

          // Clear previous frame
          ctx.clearRect(0, 0, width, height)

          // Draw example overlay (placeholder for actual AR)
          ctx.strokeStyle = "green"
          ctx.lineWidth = 3
          ctx.strokeRect(100, 100, width - 200, height - 200)

          // Draw example fret markers (placeholder)
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
          ctx.beginPath()
          ctx.arc(width / 2, height / 2, 20, 0, 2 * Math.PI)
          ctx.fill()

          // Draw moving element to show continuous updates
          const time = Date.now() / 1000
          const x = width / 2 + Math.cos(time * 2) * 100
          const y = height / 2 + Math.sin(time * 2) * 100

          ctx.fillStyle = "blue"
          ctx.beginPath()
          ctx.arc(x, y, 15, 0, 2 * Math.PI)
          ctx.fill()
        }
      }

      // Continue animation loop only if camera is still active
      if (cameraActive) {
        animationRef.current = requestAnimationFrame(updateCanvas)
      }
    }

    // Start the animation loop
    animationRef.current = requestAnimationFrame(updateCanvas)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">AR Guitar Learning</h1>
      <ARExperience songs={[
        {
          markerId: 'pattern-fret_maker',
          audioUrl: '/songs/happy-birthday-314197.mp3',
          fingerPositions: [
            { time: 0, position: { x: 0, y: 0, z: 0 }, finger: 0 },
            { time: 1000, position: { x: 1, y: 0, z: 0 }, finger: 1 }
          ]
        }
      ]} />
      {permissionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
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
        <CardContent className="p-0 relative">
          <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline autoPlay muted />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {!cameraActive && !permissionError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <div className="text-center p-4">
                  <Camera className="mx-auto h-12 w-12 mb-2" />
                  <p>Click "Start Camera" to begin</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
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
  )
}

