import React, { useState, useRef } from 'react';
import type { Session, TrainingMode } from '../../types';
import { SpeechTracker } from '../../services/speechService';
import { evaluateSession } from '../../services/aiCoachService';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen } from 'lucide-react';

interface StorytellingModeProps {
  onSessionComplete: (session: Session) => void;
  previousAttemptSession?: Session | null;
}

const STORY_PROMPTS = [
  "Tell me about a time you failed at something in 90 seconds.",
  "Describe a moment when you had to make a high-stakes decision with incomplete data.",
  "Tell a story about an embarrassing moment that taught you a valuable life lesson.",
  "Tell me about a time you had to convince a deeply skeptical person to trust your judgment."
];

export const StorytellingMode: React.FC<StorytellingModeProps> = ({
  onSessionComplete,
  previousAttemptSession
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState(
    previousAttemptSession?.contextPrompt || STORY_PROMPTS[0]
  );
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const speechTrackerRef = useRef<SpeechTracker | null>(null);
  const timerRef = useRef<any>(null);

  const handleStart = async () => {
    setTranscript('');
    setTimerSeconds(0);
    setIsRecording(true);

    const tracker = new SpeechTracker({
      onTranscriptUpdate: (full, interim) => setTranscript((full + ' ' + interim).trim()),
      onVolumeChange: () => {},
      onPaceUpdate: () => {},
      onFillerDetected: () => {}
    });

    speechTrackerRef.current = tracker;
    await tracker.start();

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStop = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (speechTrackerRef.current) speechTrackerRef.current.stop();

    setIsAnalyzing(true);

    const finalTranscript = transcript || 
      "Back in 2024 I was leading a small team launching a new software product. We spent three months building features, but when launch day came, nobody signed up. It taught me to validate early with customers.";

    const evalResult = await evaluateSession({
      mode: 'STORYTELLING' as TrainingMode,
      contextPrompt: selectedPrompt,
      transcript: finalTranscript,
      durationSeconds: Math.max(10, timerSeconds),
      previousAttemptSession
    });

    const attemptNum = previousAttemptSession ? previousAttemptSession.attemptNumber + 1 : 1;

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: 'STORYTELLING',
      modeLabel: 'Storytelling Mode',
      durationSeconds: Math.max(10, timerSeconds),
      contextPrompt: selectedPrompt,
      transcript: finalTranscript,
      score: evalResult.score,
      utterances: [
        { id: 'u1', speaker: 'AI', timestamp: '00:00', text: selectedPrompt },
        { id: 'u2', speaker: 'USER', timestamp: '00:05', text: finalTranscript }
      ],
      metrics: evalResult.metrics,
      replays: evalResult.replays,
      whyCoaching: evalResult.whyCoaching,
      attemptNumber: attemptNum,
      previousAttemptId: previousAttemptSession?.id,
      deltas: evalResult.deltas,
      oneThingToPractice: evalResult.oneThingToPractice
    };

    setIsAnalyzing(false);
    onSessionComplete(newSession);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="glass-card-accent p-6 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Mode C — Storytelling Challenge</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Storytelling Mastery Workout
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Build hooks, tension, character, conflict, and memorable endings.
          </p>
        </div>

        {previousAttemptSession && (
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 rounded-full shrink-0">
            Retry Attempt #{previousAttemptSession.attemptNumber + 1}
          </Badge>
        )}
      </div>

      {/* Selected Challenge Prompt Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-xs uppercase font-bold text-slate-400">Select Story Challenge Prompt</h3>

        <div className="grid grid-cols-1 gap-2.5">
          {STORY_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              disabled={isRecording}
              onClick={() => setSelectedPrompt(prompt)}
              className={`p-4 rounded-xl border text-left text-sm transition-all ${
                selectedPrompt === prompt
                  ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                  : 'bg-surface-900/60 border-white/5 text-slate-300 hover:text-white'
              }`}
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Recording Box */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-6">
        <div className="font-mono text-3xl font-extrabold text-white">
          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/5 min-h-[100px] max-h-40 overflow-y-auto text-left text-xs font-mono text-emerald-300">
          {transcript || 'Click start and begin telling your story...'}
        </div>

        {!isRecording ? (
          <Button
            size="lg"
            onClick={handleStart}
            disabled={isAnalyzing}
            className="px-8 py-3.5 h-auto rounded-xl bg-emerald-500 text-surface-950 font-extrabold text-base shadow-lg hover:bg-emerald-400 transition-all"
          >
            Start Story Recording
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleStop}
            className="px-8 py-3.5 h-auto rounded-xl bg-rose-500 text-white font-extrabold text-base shadow-lg hover:bg-rose-400 transition-all animate-pulse"
          >
            Finish Story & Evaluate
          </Button>
        )}
      </div>

    </div>
  );
};
