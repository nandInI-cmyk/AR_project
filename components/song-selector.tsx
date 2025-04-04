"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useSongContext } from "@/hooks/use-song-context"

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"]

export default function SongSelector() {
  const { songs, currentSong, setCurrentSong, isPlaying, togglePlayback } = useSongContext()
  const [selectedDifficulty, setSelectedDifficulty] = useState("Beginner")

  const filteredSongs = songs.filter((song) => song.difficulty === selectedDifficulty)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Song</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Song</label>
          <Select
            value={currentSong?.id || ""}
            onValueChange={(value) => {
              const song = songs.find((s) => s.id === value)
              if (song) setCurrentSong(song)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a song" />
            </SelectTrigger>
            <SelectContent>
              {filteredSongs.map((song) => (
                <SelectItem key={song.id} value={song.id}>
                  {song.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentSong && (
          <div className="pt-2">
            <Button className="w-full" onClick={togglePlayback}>
              <Play className="h-4 w-4 mr-2" />
              {isPlaying ? "Pause" : "Start Practice"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

