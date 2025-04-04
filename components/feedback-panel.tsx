"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, User } from "lucide-react"
import { getFeedback } from "@/lib/feedback-service"
import { useProgressContext } from "@/hooks/use-progress-context"
import { useSongContext } from "@/hooks/use-song-context"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function FeedbackPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { currentAccuracy, currentTiming, sessionStats } = useProgressContext()
  const { currentSong } = useSongContext()

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await getFeedback({
        message: input,
        songData: currentSong,
        performanceData: {
          accuracy: currentAccuracy,
          timing: currentTiming,
          notesPlayed: sessionStats.notesPlayed,
          minutesPracticed: sessionStats.minutesPracticed,
        },
      })

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.feedback,
        },
      ])
    } catch (error) {
      console.error("Error getting feedback:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error while generating feedback. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader>
        <CardTitle>AI Feedback</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4 pb-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="h-12 w-12 mb-2" />
            <p>Ask for feedback on your playing or suggestions for improvement</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`
                  max-w-[80%] rounded-lg p-3 
                  ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}
                `}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  <span className="text-xs font-medium">{message.role === "user" ? "You" : "AI Coach"}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for feedback or suggestions..."
            className="min-h-[60px]"
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

