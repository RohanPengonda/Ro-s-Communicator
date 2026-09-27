export type TrainingMode = 
  | 'LIVE_COACH'
  | 'STORYTELLING'
  | 'PUBLIC_SPEAKING'
  | 'INTERVIEW'
  | 'SPONTANEOUS'
  | 'EXPLAIN_SIMPLY'
  | 'CONVERSATION'
  | 'DAILY_WORKOUT';

export type MarkerType = 
  | 'STRONG_OPENING'
  | 'FILLER_SPIKE'
  | 'LOST_CLARITY'
  | 'EXCELLENT_ANALOGY'
  | 'MISSED_WIT'
  | 'STRONG_ENDING';

export interface CommunicationMetrics {
  overall: number; // 0.0 - 10.0
  storytelling: number;
  clarity: number;
  engagement: number;
  confidence: number;
  wit: number;
  spontaneity: number;
  conciseness: number;
  structure: number;
  audienceAdaptation: number;
  explanationQuality: number;
  fillerWordsCount: number;
  speakingPaceWPM: number;
  responseRelevance: number;
}

export interface SessionReplayMarker {
  id: string;
  timestampSeconds: number;
  label: string;
  type: MarkerType;
  textSnippet: string;
  advice: string;
  scoreImpact?: string;
}

export interface WhyCoachingCard {
  id: string;
  category: 'STORYTELLING' | 'WIT' | 'PUBLIC_SPEAKING' | 'COMMUNICATION';
  observation: string;
  impact: string;
  principle: string;
  exemplarReframing: string;
}

export interface Utterance {
  id: string;
  speaker: 'USER' | 'AI';
  timestamp: string;
  text: string;
  metrics?: {
    paceWPM?: number;
    fillerCount?: number;
    clarityScore?: number;
  };
}

export interface SessionDelta {
  overallChangePct: number;
  hookStrengthChangePct: number;
  clarityChangePct: number;
  fillerReductionPct: number;
  emotionalDetailChangePct: number;
  endingImpactChangePct: number;
}

export interface Session {
  id: string;
  timestamp: string;
  mode: TrainingMode;
  modeLabel: string;
  durationSeconds: number;
  contextPrompt: string;
  targetAudience?: string;
  utterances: Utterance[];
  transcript: string;
  score: number;
  metrics: CommunicationMetrics;
  replays: SessionReplayMarker[];
  whyCoaching: WhyCoachingCard[];
  attemptNumber: number;
  previousAttemptId?: string;
  deltas?: SessionDelta;
  oneThingToPractice: string;
}

export interface StoryBankItem {
  id: string;
  title: string;
  rawVersion: string;
  polishedVersion: string;
  coreConflict: string;
  turningPoint: string;
  lesson: string;
  themes: string[];
  emotions: string[];
  interviewUseCases: string[];
  practiceCount: number;
  lastPracticedAt: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  minutesPracticed: number;
  sessionsCount: number;
  exercisesCount: number;
  dailyScore: number;
  bestMoment: string;
  focusArea: string;
}

export interface CategoryScore {
  category: string;
  score: number;
  change: number;
}

export interface MonthlyReport {
  yearMonth: string; // e.g. "2026-09"
  monthName: string; // e.g. "September 2026"
  overallScore: number;
  scoreChange: number;
  categoryScores: CategoryScore[];
  biggestImprovement: string;
  biggestWeakness: string;
  recurringHabit: string;
  nextMonthFocus: string;
}

export interface UserProfile {
  name: string;
  currentOverallScore: number;
  startingScore: number;
  strongestSkill: string;
  biggestImprovement: string;
  currentWeakness: string;
  recurringPattern: string;
  naturalStrength: string;
  developingSkill: string;
  currentFocus: string;
  recommendedNextStep: string;
  streakDays: number;
  totalSessions: number;
  totalPracticeMinutes: number;
  totalStoriesPracticed: number;
  practiceConsistencyPct: number;
}

export interface WorkoutStep {
  stepNumber: number;
  title: string;
  mode: TrainingMode;
  prompt: string;
  targetDurationSeconds: number;
  completed: boolean;
  score?: number;
}

export interface DailyWorkout {
  id: string;
  title: string;
  totalEstimatedMinutes: number;
  steps: WorkoutStep[];
  currentStepIndex: number;
}
