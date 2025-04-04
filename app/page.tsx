'use client';

import { useState, useEffect } from 'react';
import ARExperience from '@/components/ARExperience';
import FingerPositionOverlay from '@/components/FingerPositionOverlay';
import Header from "@/components/header"
import ARGuitarLearning from "@/components/ar-guitar-learning"
import SongSelector from "@/components/song-selector"
import ProgressTracker from "@/components/progress-tracker"
import FeedbackPanel from "@/components/feedback-panel"
import LoadingUI from "@/components/loading-ui"


export default function Home() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isARReady, setIsARReady] = useState(false);

  // Song data with your actual song
  const songs = [
    {
      markerId: 'pattern-pattern-fret_maker',
      audioUrl: '/songs/happy-birthday-314197.mp3', // Make sure this matches your actual song file name
      fingerPositions: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, finger: 0 },
        { time: 1000, position: { x: 1, y: 0, z: 0 }, finger: 1 },
        // Add more finger positions based on your song timing
      ],
    }
  ];

  // Update current time while song is playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 100); // Update every 100ms
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Check if browser supports required features
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        // Check if WebGL is supported
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          console.error('WebGL not supported');
          return;
        }

        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('getUserMedia not supported');
          return;
        }

        // Check if Audio API is supported
        if (!window.AudioContext && !(window as any).webkitAudioContext) {
          console.error('Audio API not supported');
          return;
        }

        setIsARReady(true);
      } catch (error) {
        console.error('Error checking AR support:', error);
      }
    };

    checkARSupport();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden">
              {isARReady ? (
                <ARExperience 
                  songs={songs} 
                  onPlaybackStateChange={setIsPlaying}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white text-lg">Loading AR experience...</p>
                </div>
              )}
              <ARGuitarLearning/>
            </div>
          </div>
          <div className="space-y-6">
            <SongSelector />
            <ProgressTracker />
            <FeedbackPanel />
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Current Song</h2>
              <p className="text-gray-600">
                {isPlaying ? 'Playing' : 'Paused'} - Time: {Math.floor(currentTime / 1000)}s
              </p>
            </div>
          </div>
        </div>
      </div>
      {isARReady && (
        <FingerPositionOverlay 
          positions={songs[0]?.fingerPositions || []} 
          currentTime={currentTime} 
        />
      )}
    </main>
  );
}


