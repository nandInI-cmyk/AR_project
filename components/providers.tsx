"use client"

import type { ReactNode } from "react"
import { AudioProvider } from "@/hooks/use-audio-context"
import { SongProvider } from "@/hooks/use-song-context"
import { ProgressProvider } from "@/hooks/use-progress-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AudioProvider>
      <SongProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </SongProvider>
    </AudioProvider>
  )
}

