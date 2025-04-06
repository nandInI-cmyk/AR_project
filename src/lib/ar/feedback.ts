import { FeedbackRequest, FeedbackResponse } from '@/types/ar';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Guitar-specific knowledge base for the AI
const GUITAR_KNOWLEDGE = `
# Guitar Playing Techniques
- Proper fretting technique involves placing fingers just behind the fret
- Use fingertips, not finger pads, for cleaner notes
- Keep thumb positioned behind the neck for better reach
- Maintain relaxed wrist and hand position to prevent strain

# Common Beginner Issues
- Pressing too hard on strings (causing sharp notes)
- Not pressing hard enough (causing buzzing)
- Poor timing between chord changes
- Inconsistent strumming patterns
- Difficulty with barre chords

# Practice Recommendations
- Use a metronome to improve timing
- Practice chord transitions slowly then increase speed
- Focus on clean note articulation before speed
- Record yourself playing to identify issues
- Practice in short, focused sessions rather than long unfocused ones

# Finger Exercises
- Chromatic exercises (1-2-3-4 on each string)
- Spider exercises for finger independence
- String skipping exercises for coordination
- Legato exercises (hammer-ons and pull-offs)
`;

export async function getFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  try {
    const context = `
      Student performance data:
      - Song: ${request.songId}
      - Accuracy: ${request.performance.accuracy}%
      - Timing: ${request.performance.timing}%
      - Speed: ${request.performance.speed}%
      
      Student question: ${request.question || "General feedback please"}
      
      ${GUITAR_KNOWLEDGE}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert guitar teacher assistant with deep knowledge of guitar techniques, music theory, and effective practice methods. 
          
          Provide constructive, personalized feedback based on the student's performance data. Be specific about what they're doing well and what they can improve.
          
          When responding:
          1. Address the student's specific question first
          2. Provide actionable advice based on their performance data
          3. Be encouraging but honest about areas for improvement
          4. Suggest specific exercises or techniques that would help them improve
          5. Keep responses conversational and supportive`
        },
        {
          role: "user",
          content: context
        }
      ]
    });

    const feedback = completion.choices[0]?.message?.content || "Unable to generate feedback";

    // Extract suggested exercises and next steps using pattern matching
    const suggestedExercises = extractExercises(feedback);
    const nextSteps = extractNextSteps(feedback);

    return {
      feedback,
      suggestedExercises: suggestedExercises.length > 0 ? suggestedExercises : undefined,
      nextSteps: nextSteps.length > 0 ? nextSteps : undefined,
    };
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw new Error("Failed to generate feedback");
  }
}

function extractExercises(text: string): string[] {
  const exerciseMatch = text.match(/Exercise suggestions?:(.*?)(?=\n\n|\n#|$)/is);
  return exerciseMatch 
    ? exerciseMatch[1].trim().split('\n').map(e => e.trim().replace(/^-\s*/, ''))
    : [];
}

function extractNextSteps(text: string): string[] {
  const stepsMatch = text.match(/Next steps?:(.*?)(?=\n\n|\n#|$)/is);
  return stepsMatch
    ? stepsMatch[1].trim().split('\n').map(e => e.trim().replace(/^-\s*/, ''))
    : [];
}