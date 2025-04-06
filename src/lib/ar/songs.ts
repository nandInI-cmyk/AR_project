import { Song } from '@/types/ar';

export const DEMO_SONGS: Song[] = [
  {
    id: "happy-birthday",
    title: "Happy Birthday",
    artist: "Traditional",
    difficulty: "Beginner",
    bpm: 90,
    audioUrl: "/songs/happy-birthday.mp3",
    markerUrl: "/markers/happy-birthday-marker.patt",
    description: "A simple melody perfect for beginners.",
    notes: [
      { fret: 0, string: 1, time: 0, duration: 0.5, finger: 0 },
      { fret: 0, string: 1, time: 0.5, duration: 0.5, finger: 0 },
      { fret: 2, string: 1, time: 1, duration: 1, finger: 2 },
      { fret: 0, string: 1, time: 2, duration: 1, finger: 0 },
      { fret: 5, string: 1, time: 3, duration: 1, finger: 4 },
      { fret: 4, string: 1, time: 4, duration: 2, finger: 3 },
    ]
  },
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    artist: "Beethoven",
    difficulty: "Intermediate",
    bpm: 100,
    audioUrl: "/songs/ode-to-joy.mp3",
    markerUrl: "/markers/ode-joy-marker.patt",
    description: "A classical melody adapted for guitar. Great for practicing finger positioning and timing.",
    notes: [
      { fret: 0, string: 2, time: 0, duration: 0.5, finger: 0 },
      { fret: 0, string: 2, time: 0.5, duration: 0.5, finger: 0 },
      { fret: 1, string: 2, time: 1, duration: 0.5, finger: 1 },
      { fret: 3, string: 2, time: 1.5, duration: 0.5, finger: 3 },
      { fret: 3, string: 2, time: 2, duration: 0.5, finger: 3 },
      { fret: 1, string: 2, time: 2.5, duration: 0.5, finger: 1 },
      { fret: 0, string: 2, time: 3, duration: 0.5, finger: 0 },
      { fret: 3, string: 3, time: 3.5, duration: 0.5, finger: 3 },
      { fret: 2, string: 3, time: 4, duration: 0.5, finger: 2 },
      { fret: 0, string: 3, time: 4.5, duration: 0.5, finger: 0 },
      { fret: 0, string: 3, time: 5, duration: 1, finger: 0 },
    ]
  }
];

export async function getSongs(): Promise<Song[]> {
  return DEMO_SONGS;
}

export async function getSongById(id: string): Promise<Song | undefined> {
  return DEMO_SONGS.find(song => song.id === id);
}

export function getSongDifficulties(): string[] {
  return [...new Set(DEMO_SONGS.map(song => song.difficulty))];
}

export function filterSongsByDifficulty(difficulty: string): Song[] {
  return DEMO_SONGS.filter(song => song.difficulty === difficulty);
}