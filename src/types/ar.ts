import * as THREE from 'three';

export interface ARInitOptions {
  container: HTMLElement;
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  onInitialized: () => void;
  onError: (error: Error) => void;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: string;
  bpm: number;
  audioUrl: string;
  markerUrl: string;
  description: string;
  notes: Note[];
}

export interface Note {
  fret: number;
  string: number;
  time: number;
  duration: number;
  finger: number;
}

export interface FeedbackRequest {
  songId: string;
  userId: string;
  performance: {
    accuracy: number;
    timing: number;
    speed: number;
  };
  question?: string;
}

export interface FeedbackResponse {
  feedback: string;
  suggestedExercises?: string[];
  nextSteps?: string[];
}

export interface GuitarFretboardMarker {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  width: number;
  height: number;
}