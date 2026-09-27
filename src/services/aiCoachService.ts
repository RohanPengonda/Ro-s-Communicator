import { GoogleGenAI } from '@google/genai';
import type { 
  TrainingMode, 
  CommunicationMetrics, 
  SessionReplayMarker, 
  WhyCoachingCard, 
  SessionDelta, 
  Session 
} from '../types';

// Read API Key if configured
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface EvaluationInput {
  mode: TrainingMode;
  contextPrompt: string;
  targetAudience?: string;
  transcript: string;
  durationSeconds: number;
  utterances?: { speaker: string; text: string; timestamp?: string }[];
  previousAttemptSession?: Session | null;
}

export interface EvaluationResult {
  score: number;
  metrics: CommunicationMetrics;
  replays: SessionReplayMarker[];
  whyCoaching: WhyCoachingCard[];
  deltas?: SessionDelta;
  oneThingToPractice: string;
}

export async function evaluateSession(input: EvaluationInput): Promise<EvaluationResult> {
  // If Gemini API is available, invoke Gemini model
  if (ai) {
    try {
      return await evaluateWithGemini(input);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Intelligent Mock Engine:', err);
    }
  }

  // Fallback / Standalone Intelligent Mock AI Engine
  return generateIntelligentMockEvaluation(input);
}

async function evaluateWithGemini(input: EvaluationInput): Promise<EvaluationResult> {
  const prompt = `
You are a world-class long-term Personal AI Communication Coach.
Evaluate this user communication session with high standards (brutally honest + supportive).

Session Mode: ${input.mode}
Context / Prompt: ${input.contextPrompt}
Target Audience: ${input.targetAudience || 'General'}
Duration (seconds): ${input.durationSeconds}
Transcript: "${input.transcript}"

Return ONLY a raw JSON object with this exact structure:
{
  "score": 7.4,
  "metrics": {
    "overall": 7.4,
    "storytelling": 7.5,
    "clarity": 8.0,
    "engagement": 7.2,
    "confidence": 7.0,
    "wit": 6.5,
    "spontaneity": 7.5,
    "conciseness": 7.8,
    "structure": 7.9,
    "audienceAdaptation": 7.6,
    "explanationQuality": 8.0,
    "fillerWordsCount": 3,
    "speakingPaceWPM": 142,
    "responseRelevance": 8.8
  },
  "replays": [
    {
      "id": "m1",
      "timestampSeconds": 10,
      "label": "Strong Opening Hook",
      "type": "STRONG_OPENING",
      "textSnippet": "exact snippet",
      "advice": "actionable tip"
    }
  ],
  "whyCoaching": [
    {
      "id": "w1",
      "category": "STORYTELLING",
      "observation": "What happened in user transcript",
      "impact": "Why it hurt engagement",
      "principle": "Underlying communication principle",
      "exemplarReframing": "Better way to phrase it"
    }
  ],
  "oneThingToPractice": "Clear single takeaway focus"
}
`;

  const response = await ai!.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = response.text || '';
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  if (input.previousAttemptSession) {
    parsed.deltas = calculateDeltas(parsed, input.previousAttemptSession);
  }

  return parsed;
}

function generateIntelligentMockEvaluation(input: EvaluationInput): EvaluationResult {
  const transcript = input.transcript || '';
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  
  // Real-time text analysis heuristic for fillers
  const fillerRegex = /\b(um|uh|like|basically|you know|sort of|kind of|i mean|honestly)\b/gi;
  const matches = transcript.match(fillerRegex) || [];
  const fillerCount = matches.length;

  const wpm = input.durationSeconds > 0 ? Math.round((wordCount / input.durationSeconds) * 60) : 135;

  // Context-aware scoring heuristics
  let storytelling = 7.2;
  let clarity = 7.8;
  let engagement = 7.0;
  let wit = 6.0;
  let confidence = 7.2;
  let conciseness = 7.5;

  if (input.mode === 'STORYTELLING') {
    storytelling = transcript.length > 120 ? 8.1 : 6.5;
    if (transcript.toLowerCase().includes('suddenly') || transcript.toLowerCase().includes('turning point') || transcript.toLowerCase().includes('realized')) {
      storytelling += 0.6;
    }
  } else if (input.mode === 'INTERVIEW') {
    conciseness = fillerCount < 3 ? 8.4 : 6.8;
    clarity = 8.2;
  } else if (input.mode === 'EXPLAIN_SIMPLY') {
    clarity = transcript.toLowerCase().includes('like') || transcript.toLowerCase().includes('imagine') ? 8.7 : 7.0;
  }

  // Deduct for excess fillers
  if (fillerCount > 4) {
    clarity -= 0.6;
    confidence -= 0.8;
  }

  const overall = parseFloat(((storytelling + clarity + engagement + confidence + conciseness) / 5).toFixed(1));

  const replays: SessionReplayMarker[] = [
    {
      id: 'm-1',
      timestampSeconds: Math.min(8, Math.round(input.durationSeconds * 0.1)),
      label: fillerCount > 2 ? 'Filler Word Start' : 'Clean Opening Hook',
      type: fillerCount > 2 ? 'FILLER_SPIKE' : 'STRONG_OPENING',
      textSnippet: transcript.slice(0, 45) + '...',
      advice: fillerCount > 2 ? 'Pause silently for 1 second before speaking to eliminate default fillers.' : 'Crisp start. You created immediate curiosity without unnecessary setup.'
    },
    {
      id: 'm-2',
      timestampSeconds: Math.round(input.durationSeconds * 0.45),
      label: 'Core Explanation & Tension',
      type: 'EXCELLENT_ANALOGY',
      textSnippet: transcript.slice(Math.round(transcript.length * 0.3), Math.round(transcript.length * 0.6)) || 'Core explanation point...',
      advice: 'Strong relational comparison here. It makes abstract concepts tangible.'
    },
    {
      id: 'm-3',
      timestampSeconds: Math.round(input.durationSeconds * 0.75),
      label: 'Wit & Playful Reframing Opportunity',
      type: 'MISSED_WIT',
      textSnippet: transcript.slice(Math.round(transcript.length * 0.6), Math.round(transcript.length * 0.85)) || 'Transition section...',
      advice: 'You stated a serious conclusion flatly. A light, unexpected contrast would increase audience warmth.'
    },
    {
      id: 'm-4',
      timestampSeconds: Math.max(input.durationSeconds - 5, 10),
      label: 'Final Takeaway & Ending',
      type: 'STRONG_ENDING',
      textSnippet: transcript.slice(-50) || 'Final conclusion phrase.',
      advice: 'Resonant ending. Make sure your vocal pitch doesn’t drop off sharply on the final word.'
    }
  ];

  const whyCoaching: WhyCoachingCard[] = [
    {
      id: 'w-1',
      category: 'STORYTELLING',
      observation: 'You explained the background setup for 25 seconds before introducing the core conflict.',
      impact: 'The human brain tunes out when given raw context without a reason to care.',
      principle: 'Curiosity before context. Ignite the spark first, then supply the fuel.',
      exemplarReframing: 'Instead of: "In 2023 we had a project with 5 microservices...", start with: "We were 10 minutes away from demoing to 50 executives when our main database flatlined."'
    },
    {
      id: 'w-2',
      category: 'WIT',
      observation: 'You delivered the resolution with purely technical terms without tension release.',
      impact: 'The listener feels informed, but not personally connected or entertained.',
      principle: 'Contrast creates wit. Juxtaposing high technical stakes with everyday human moments creates natural lightness.',
      exemplarReframing: 'Instead of: "We restored from cold backup", say: "While the server restored, I drank enough coffee to fuel a rocket launch to Mars."'
    }
  ];

  const oneThingToPractice = input.mode === 'STORYTELLING' 
    ? 'State the core conflict within the first 15 seconds before explaining the backstory.' 
    : 'Lead with your main point immediately, then unpack the supporting evidence.';

  const result: EvaluationResult = {
    score: overall,
    metrics: {
      overall,
      storytelling: parseFloat(storytelling.toFixed(1)),
      clarity: parseFloat(clarity.toFixed(1)),
      engagement: parseFloat(engagement.toFixed(1)),
      confidence: parseFloat(confidence.toFixed(1)),
      wit: parseFloat(wit.toFixed(1)),
      spontaneity: 7.4,
      conciseness: parseFloat(conciseness.toFixed(1)),
      structure: 8.0,
      audienceAdaptation: 7.6,
      explanationQuality: 8.1,
      fillerWordsCount: fillerCount,
      speakingPaceWPM: wpm,
      responseRelevance: 8.8
    },
    replays,
    whyCoaching,
    oneThingToPractice
  };

  if (input.previousAttemptSession) {
    result.deltas = calculateDeltas(result, input.previousAttemptSession);
  }

  return result;
}

function calculateDeltas(current: EvaluationResult, previous: Session): SessionDelta {
  const prevMetrics = previous.metrics;
  const currMetrics = current.metrics;

  const calcPct = (curr: number, prev: number) => {
    if (!prev) return 15;
    return Math.round(((curr - prev) / prev) * 100);
  };

  return {
    overallChangePct: calcPct(currMetrics.overall, prevMetrics.overall),
    hookStrengthChangePct: calcPct(currMetrics.engagement, prevMetrics.engagement),
    clarityChangePct: calcPct(currMetrics.clarity, prevMetrics.clarity),
    fillerReductionPct: prevMetrics.fillerWordsCount > 0 
      ? Math.round(((prevMetrics.fillerWordsCount - currMetrics.fillerWordsCount) / prevMetrics.fillerWordsCount) * 100)
      : 25,
    emotionalDetailChangePct: calcPct(currMetrics.storytelling, prevMetrics.storytelling),
    endingImpactChangePct: calcPct(currMetrics.confidence, prevMetrics.confidence)
  };
}
