"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSongs } from "@/lib/song-service"

export type Note = {
  fret: number
  string: number
  time: number
  duration: number
}

export type Song = {
  id: string
  title: string
  artist: string
  difficulty: string
  bpm: number
  notes: Note[]
}

type SongContextType = {
  songs: Song[]
  currentSong: Song | null
  setCurrentSong: (song: Song) => void
  isLoading: boolean
  isPlaying: boolean
  togglePlayback: () => void
  currentNoteIndex: number
}

const SongContext = createContext<SongContextType>({
  songs: [],
  currentSong: null,
  setCurrentSong: () => {},
  isLoading: true,
  isPlaying: false,
  togglePlayback: () => {},
  currentNoteIndex: -1,
})

export function SongProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songsData = await getSongs()
        setSongs(songsData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching songs:", error)
        setIsLoading(false)
      }
    }

    fetchSongs()
  }, [])

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setCurrentNoteIndex(-1)
    } else {
      setIsPlaying(true)
      setCurrentNoteIndex(0)
    }
  }

  useEffect(() => {
    if (!isPlaying || !currentSong || currentNoteIndex === -1) return

    const noteInterval = setInterval(() => {
      if (currentNoteIndex < currentSong.notes.length - 1) {
        setCurrentNoteIndex((prev) => prev + 1)
      } else {
        setIsPlaying(false)
        setCurrentNoteIndex(-1)
        clearInterval(noteInterval)
      }
    }, 60000 / currentSong.bpm)

    return () => clearInterval(noteInterval)
  }, [isPlaying, currentSong, currentNoteIndex])

  return (
    <SongContext.Provider
      value={{
        songs,
        currentSong,
        setCurrentSong,
        isLoading,
        isPlaying,
        togglePlayback,
        currentNoteIndex,
      }}
    >
      {children}
    </SongContext.Provider>
  )
}

export function useSongContext() {
  return useContext(SongContext)
}

