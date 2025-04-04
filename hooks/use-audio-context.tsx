"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AudioContextType = {
  audioContext: AudioContext | null
  isAudioInitialized: boolean
  initializeAudio: () => void
  playNote: (frequency: number, duration: number) => void
}

const AudioContext = createContext<AudioContextType>({
  audioContext: null,
  isAudioInitialized: false,
  initializeAudio: () => {},
  playNote: () => {},
})

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [isAudioInitialized, setIsAudioInitialized] = useState(false)

  const initializeAudio = () => {
    if (audioContext) return

    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(context)
      setIsAudioInitialized(true)
    } catch (error) {
      console.error("Web Audio API is not supported in this browser", error)
    }
  }

  const playNote = (frequency: number, duration: number) => {
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.value = frequency

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)
  }

  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [audioContext])

  return (
    <AudioContext.Provider
      value={{
        audioContext,
        isAudioInitialized,
        initializeAudio,
        playNote,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudioContext() {
  return useContext(AudioContext)
}

