import React, { useState } from 'react';
import type { DailyWorkout, Session } from '../../types';
import { StorytellingMode } from './StorytellingMode';
import { ExplainSimplyMode } from './ExplainSimplyMode';
import { SpontaneousChallengeMode } from './SpontaneousChallengeMode';
import { Badge } from '../ui/badge';
import { Flame, CheckCircle2 } from 'lucide-react';

interface Props {
  onWorkoutComplete: (totalScore: number) => void;
  onSessionComplete: (session: Session) => void;
}

export const DailyWorkoutMode: React.FC<Props> = ({ onWorkoutComplete, onSessionComplete }) => {
  const [workout, setWorkout] = useState<DailyWorkout>({
    id: `workout-${Date.now()}`,
    title: "Today's 8-Minute Adaptive Workout",
    totalEstimatedMinutes: 8,
    currentStepIndex: 0,
    steps: [
      {
        stepNumber: 1,
        title: "60-Second Storytelling Hook",
        mode: 'STORYTELLING',
        prompt: "Tell me about a time you failed at something in 90 seconds.",
        targetDurationSeconds: 90,
        completed: false
      },
      {
        stepNumber: 2,
        title: "Explain Complex Concept Simply",
        mode: 'EXPLAIN_SIMPLY',
        prompt: "Explain RAG vector search to a 10-year-old using a library analogy.",
        targetDurationSeconds: 60,
        completed: false
      },
      {
        stepNumber: 3,
        title: "Spontaneous Surprise Response",
        mode: 'SPONTANEOUS',
        prompt: "Convince me that failure is useful in 45 seconds.",
        targetDurationSeconds: 45,
        completed: false
      },
      {
        stepNumber: 4,
        title: "Repeat Yesterday's Weak Area (Memorable Openings)",
        mode: 'STORYTELLING',
        prompt: "Create a 30-second high-curiosity opening for a technical outage story.",
        targetDurationSeconds: 30,
        completed: false
      }
    ]
  });

  const currentStep = workout.steps[workout.currentStepIndex];

  const handleStepSessionComplete = (session: Session) => {
    onSessionComplete(session);

    // Update current step as completed
    const updatedSteps = [...workout.steps];
    updatedSteps[workout.currentStepIndex] = {
      ...currentStep,
      completed: true,
      score: session.score
    };

    if (workout.currentStepIndex < workout.steps.length - 1) {
      setWorkout({
        ...workout,
        steps: updatedSteps,
        currentStepIndex: workout.currentStepIndex + 1
      });
    } else {
      // Workout finish
      const avgScore = updatedSteps.reduce((acc, s) => acc + (s.score || 7.0), 0) / updatedSteps.length;
      onWorkoutComplete(parseFloat(avgScore.toFixed(1)));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Workout Progress Header */}
      <div className="glass-card-accent p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-600 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Today's Daily Communication Workout (8 Mins)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{workout.title}</h2>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 bg-surface-900/80 p-2.5 rounded-xl border border-black/10 shrink-0">
          {workout.steps.map((step, idx) => (
            <Badge
              key={step.stepNumber}
              className={`gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                step.completed
                  ? 'bg-emerald-500 text-white'
                  : idx === workout.currentStepIndex
                  ? 'bg-amber-500 text-slate-900 animate-pulse'
                  : 'bg-surface-800 text-slate-500'
              }`}
            >
              {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>Step {step.stepNumber}</span>}
            </Badge>
          ))}
        </div>
      </div>

      {/* Step Info Card */}
      <div className="glass-panel p-4 rounded-xl border border-black/10 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 uppercase font-bold">Step {currentStep.stepNumber} of {workout.steps.length}</span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{currentStep.title}</h3>
        </div>
        <span className="text-xs font-semibold text-violet-600 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
          Prompt: "{currentStep.prompt}"
        </span>
      </div>

      {/* Dynamic Submode Render */}
      {currentStep.mode === 'STORYTELLING' && (
        <StorytellingMode onSessionComplete={handleStepSessionComplete} />
      )}
      {currentStep.mode === 'EXPLAIN_SIMPLY' && (
        <ExplainSimplyMode onSessionComplete={handleStepSessionComplete} />
      )}
      {currentStep.mode === 'SPONTANEOUS' && (
        <SpontaneousChallengeMode onSessionComplete={handleStepSessionComplete} />
      )}

    </div>
  );
};
