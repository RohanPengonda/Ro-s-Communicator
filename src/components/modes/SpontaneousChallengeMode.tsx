import React, { useState, useEffect, useRef } from 'react';
import type { Session, TrainingMode } from '../../types';
import { SpeechTracker } from '../../services/speechService';
import { evaluateSession } from '../../services/aiCoachService';
import { Button } from '../ui/button';
import { Zap, RefreshCw } from 'lucide-react';

interface Props {
  onSessionComplete: (session: Session) => void;
}

const SURPRISE_PROMPTS = [
  "You have 30 seconds. Convince me that failure is useful.",
  "Someone strongly disagrees with your career strategy. Respond in 45 seconds.",
  "Describe an uncomfortable truth about leadership that most executives ignore.",
  "Explain why taking small risks daily builds massive long-term momentum."
];

export const SpontaneousChallengeMode: React.FC<Props> = ({ onSessionComplete }) => {
  const [prompt, setPrompt] = useState(SURPRISE_PROMPTS[0]);
  const [countdown, setCountdown] = useState(5);
  const [prepActive, setPrepActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);

  const trackerRef = useRef<SpeechTracker | null>(null);
  const timerRef = useRef<any>(null);

  const handleSurpriseMe = () => {
    const random = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(random);
    setCountdown(5);
    setPrepActive(true);
  };

  useEffect(() => {
    let interval: any;
    if (prepActive && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (prepActive && countdown === 0) {
      setPrepActive(false);
      handleStartRecording();
    }
    return () => clearInterval(interval);
  }, [prepActive, countdown]);

  const handleStartRecording = async () => {
    setTranscript('');
    setTimerSeconds(0);
    setIsRecording(true);

    const tracker = new SpeechTracker({
      onTranscriptUpdate: (full, interim) => setTranscript((full + ' ' + interim).trim()),
      onVolumeChange: () => {},
      onPaceUpdate: () => {},
      onFillerDetected: () => {}
    });

    trackerRef.current = tracker;
    await tracker.start();

    timerRef.current = setInterval(() => setTimerSeconds((p) => p + 1), 1000);
  };

  const handleStop = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (trackerRef.current) trackerRef.current.stop();

    const finalTranscript = transcript || "Failure provides real empirical evidence of boundaries that smooth success never reveals.";

    const evalResult = await evaluateSession({
      mode: 'SPONTANEOUS' as TrainingMode,
      contextPrompt: prompt,
      transcript: finalTranscript,
      durationSeconds: Math.max(10, timerSeconds)
    });

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: 'SPONTANEOUS',
      modeLabel: 'Spontaneous Challenge Mode',
      durationSeconds: Math.max(10, timerSeconds),
      contextPrompt: prompt,
      transcript: finalTranscript,
      score: evalResult.score,
      utterances: [{ id: 'u1', speaker: 'USER', timestamp: '00:00', text: finalTranscript }],
      metrics: evalResult.metrics,
      replays: evalResult.replays,
      whyCoaching: evalResult.whyCoaching,
      attemptNumber: 1,
      oneThingToPractice: evalResult.oneThingToPractice
    };

    onSessionComplete(newSession);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Mode F — Spontaneous Agility</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Rapid-Fire Surprise Challenges</h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSurpriseMe}
          className="gap-2 rounded-xl bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 hover:text-amber-200 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          New Random Prompt
        </Button>
      </div>

      {/* Surprise Prompt Card */}
      <div className="glass-card-accent p-8 rounded-2xl border border-amber-500/30 text-center space-y-4">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Surprise Challenge Prompt</span>
        <h3 className="text-2xl font-extrabold text-white max-w-2xl mx-auto">
          "{prompt}"
        </h3>

        {prepActive && (
          <div className="text-xl font-bold text-amber-400 animate-pulse">
            Prep Countdown: {countdown}s
          </div>
        )}
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-6">
        <div className="font-mono text-3xl font-extrabold text-white">
          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/5 min-h-[100px] text-left text-xs font-mono text-amber-300">
          {transcript || 'Click start or new prompt to test spontaneous agility...'}
        </div>

        {!isRecording ? (
          <Button size="lg" onClick={handleStartRecording} className="px-8 py-3.5 h-auto rounded-xl bg-amber-500 text-surface-950 font-bold hover:bg-amber-400">
            Start Spontaneous Answer
          </Button>
        ) : (
          <Button size="lg" onClick={handleStop} className="px-8 py-3.5 h-auto rounded-xl bg-rose-500 text-white font-bold animate-pulse">
            Finish & Evaluate
          </Button>
        )}
      </div>
    </div>
  );
};
