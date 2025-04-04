"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useProgressContext } from "@/hooks/use-progress-context"

export default function ProgressTracker() {
  const { currentAccuracy, currentTiming, overallProgress, sessionStats } = useProgressContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Note Accuracy</span>
            <span className="font-medium">{currentAccuracy}%</span>
          </div>
          <Progress value={currentAccuracy} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Timing</span>
            <span className="font-medium">{currentTiming}%</span>
          </div>
          <Progress value={currentTiming} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-2 bg-muted rounded-md">
            <div className="text-2xl font-bold">{sessionStats.notesPlayed}</div>
            <div className="text-xs text-muted-foreground">Notes Played</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-md">
            <div className="text-2xl font-bold">{sessionStats.minutesPracticed}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

