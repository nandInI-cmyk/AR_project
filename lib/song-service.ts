import type { Song } from "@/hooks/use-song-context"

// Mock data for songs - in a real app, this would come from your backend
const MOCK_SONGS: Song[] = [
  {
    id: "song1",
    title: "Happy Birthday",
    artist: "Traditional",
    difficulty: "Beginner",
    bpm: 90,
    notes: [
      { fret: 0, string: 1, time: 0, duration: 0.5 },
      { fret: 0, string: 1, time: 0.5, duration: 0.5 },
      { fret: 2, string: 1, time: 1, duration: 1 },
      { fret: 0, string: 1, time: 2, duration: 1 },
      { fret: 5, string: 2, time: 3, duration: 1 },
      { fret: 4, string: 2, time: 4, duration: 2 },
    ],
  },
  {
    id: "song2",
    title: "Smoke on the Water",
    artist: "Deep Purple",
    difficulty: "Beginner",
    bpm: 112,
    notes: [
      { fret: 0, string: 5, time: 0, duration: 1 },
      { fret: 3, string: 5, time: 1, duration: 1 },
      { fret: 5, string: 5, time: 2, duration: 1 },
      { fret: 0, string: 5, time: 3, duration: 1 },
      { fret: 3, string: 5, time: 4, duration: 1 },
      { fret: 6, string: 5, time: 5, duration: 1 },
      { fret: 5, string: 5, time: 6, duration: 1 },
    ],
  },
  {
    id: "song3",
    title: "Wonderwall",
    artist: "Oasis",
    difficulty: "Intermediate",
    bpm: 86,
    notes: [
      { fret: 3, string: 4, time: 0, duration: 0.5 },
      { fret: 3, string: 3, time: 0.5, duration: 0.5 },
      { fret: 0, string: 2, time: 1, duration: 0.5 },
      { fret: 2, string: 1, time: 1.5, duration: 0.5 },
      { fret: 3, string: 1, time: 2, duration: 1 },
    ],
  },
  {
    id: "song4",
    title: "Nothing Else Matters",
    artist: "Metallica",
    difficulty: "Intermediate",
    bpm: 69,
    notes: [
      { fret: 0, string: 0, time: 0, duration: 0.5 },
      { fret: 7, string: 1, time: 0.5, duration: 0.5 },
      { fret: 7, string: 2, time: 1, duration: 0.5 },
      { fret: 7, string: 3, time: 1.5, duration: 0.5 },
      { fret: 7, string: 2, time: 2, duration: 0.5 },
      { fret: 7, string: 1, time: 2.5, duration: 0.5 },
    ],
  },
  {
    id: "song5",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    difficulty: "Advanced",
    bpm: 73,
    notes: [
      { fret: 7, string: 1, time: 0, duration: 0.5 },
      { fret: 5, string: 0, time: 0.5, duration: 0.5 },
      { fret: 7, string: 1, time: 1, duration: 0.5 },
      { fret: 8, string: 1, time: 1.5, duration: 0.5 },
      { fret: 8, string: 0, time: 2, duration: 1 },
    ],
  },
]

export async function getSongs(): Promise<Song[]> {
  // In a real app, this would fetch from your API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SONGS)
    }, 500)
  })
}

export async function getSongById(id: string): Promise<Song | null> {
  // In a real app, this would fetch from your API
  return new Promise((resolve) => {
    setTimeout(() => {
      const song = MOCK_SONGS.find((s) => s.id === id) || null
      resolve(song)
    }, 300)
  })
}

