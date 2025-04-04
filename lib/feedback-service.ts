import type { Song } from "@/hooks/use-song-context"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type PerformanceData = {
  accuracy: number
  timing: number
  notesPlayed: number
  minutesPracticed: number
}

type FeedbackRequest = {
  message: string
  songData: Song | null
  performanceData: PerformanceData
}

type FeedbackResponse = {
  feedback: string
}

export async function getFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  try {
    const { message, songData, performanceData } = request

    // Create a context for the AI based on performance data
    const context = `
      Song: ${songData?.title || "Unknown"} by ${songData?.artist || "Unknown"}
      Difficulty: ${songData?.difficulty || "Unknown"}
      BPM: ${songData?.bpm || "Unknown"}
      
      Performance Data:
      - Note Accuracy: ${performanceData.accuracy}%
      - Timing Accuracy: ${performanceData.timing}%
      - Notes Played: ${performanceData.notesPlayed}
      - Practice Time: ${performanceData.minutesPracticed.toFixed(2)} minutes
      
      User Question: ${message}
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: context,
      system: `You are a helpful guitar teacher assistant. Provide constructive feedback, tips, and encouragement based on the student's performance data. Be specific about what they're doing well and what they can improve. If they ask about technique, theory, or other guitar-related questions, provide helpful and accurate information. Keep responses concise but informative.`,
    })

    return { feedback: text }
  } catch (error) {
    console.error("Error generating feedback:", error)
    throw new Error("Failed to generate feedback")
  }
}

