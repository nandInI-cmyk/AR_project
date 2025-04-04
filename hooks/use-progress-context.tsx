"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSongContext } from "./use-song-context"

type SessionStats = {
  notesPlayed: number
  correctNotes: number
  minutesPracticed: number
}

type ProgressContextType = {
  currentAccuracy: number
  currentTiming: number
  overallProgress: number
  sessionStats: SessionStats
  recordNoteAttempt: (isCorrect: boolean, timingError: number) => void
}

const ProgressContext = createContext<ProgressContextType>({
  currentAccuracy: 0,
  currentTiming: 0,
  overallProgress: 0,
  sessionStats: {
    notesPlayed: 0,
    correctNotes: 0,
    minutesPracticed: 0,
  },
  recordNoteAttempt: () => {},
})

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { isPlaying } = useSongContext()
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [currentAccuracy, setCurrentAccuracy] = useState(0)
  const [currentTiming, setCurrentTiming] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    notesPlayed: 0,
    correctNotes: 0,
    minutesPracticed: 0,
  })

  useEffect(() => {
    if (isPlaying && !sessionStartTime) {
      setSessionStartTime(new Date())
    }

    if (!isPlaying && sessionStartTime) {
      const endTime = new Date()
      const minutesElapsed = (endTime.getTime() - sessionStartTime.getTime()) / 60000

      setSessionStats((prev) => ({
        ...prev,
        minutesPracticed: prev.minutesPracticed + minutesElapsed,
      }))

      setSessionStartTime(null)
    }
  }, [isPlaying, sessionStartTime])

  const recordNoteAttempt = (isCorrect: boolean, timingError: number) => {
    setSessionStats((prev) => ({
      ...prev,
      notesPlayed: prev.notesPlayed + 1,
      correctNotes: isCorrect ? prev.correctNotes + 1 : prev.correctNotes,
    }))

    // Update accuracy
    const newAccuracy = sessionStats.notesPlayed > 0 ? (sessionStats.correctNotes / sessionStats.notesPlayed) * 100 : 0
    setCurrentAccuracy(Math.round(newAccuracy))

    // Update timing (100% - average timing error percentage)
    const timingScore = Math.max(0, 100 - timingError)
    setCurrentTiming((prev) => {
      const avgTiming =
        sessionStats.notesPlayed > 0
          ? (prev * (sessionStats.notesPlayed - 1) + timingScore) / sessionStats.notesPlayed
          : timingScore
      return Math.round(avgTiming)
    })

    // Calculate overall progress (weighted average of accuracy and timing)
    setOverallProgress(Math.round(currentAccuracy * 0.6 + currentTiming * 0.4))
  }

  return (
    <ProgressContext.Provider
      value={{
        currentAccuracy,
        currentTiming,
        overallProgress,
        sessionStats,
        recordNoteAttempt,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgressContext() {
  return useContext(ProgressContext)
}

