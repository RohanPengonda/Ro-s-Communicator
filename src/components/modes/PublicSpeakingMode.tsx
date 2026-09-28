import React, { useState, useRef } from 'react';
import type { Session, TrainingMode } from '../../types';
import { SpeechTracker } from '../../services/speechService';
import { evaluateSession } from '../../services/aiCoachService';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';

interface Props {
  onSessionComplete: (session: Session) => void;
}

export const PublicSpeakingMode: React.FC<Props> = ({ onSessionComplete }) => {
  const [topic, setTopic] = useState("Explain artificial intelligence to a room of college students in two minutes.");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [audienceReaction, setAudienceReaction] = useState('Attentive');

  const trackerRef = useRef<SpeechTracker | null>(null);
  const timerRef = useRef<any>(null);

  const handleStart = async () => {
    setTranscript('');
    setTimerSeconds(0);
    setIsRecording(true);

    const tracker = new SpeechTracker({
      onTranscriptUpdate: (full, interim) => {
        setTranscript((full + ' ' + interim).trim());
        if (full.length > 100) setAudienceReaction('Highly Engaged 🔥');
      },
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

    const finalTranscript = transcript || "Imagine asking an AI a question about a 500-page document and having it answer with the exact page citation in 2 seconds.";

    const evalResult = await evaluateSession({
      mode: 'PUBLIC_SPEAKING' as TrainingMode,
      contextPrompt: topic,
      targetAudience: 'College Students Room',
      transcript: finalTranscript,
      durationSeconds: Math.max(10, timerSeconds)
    });

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: 'PUBLIC_SPEAKING',
      modeLabel: 'Public Speaking Mode',
      durationSeconds: Math.max(10, timerSeconds),
      contextPrompt: topic,
      targetAudience: 'College Students',
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
      <div className="glass-panel p-6 rounded-2xl border border-black/10 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-cyan-600 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Mode D — Public Speaking Simulator</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Presentation & Audience Pacing</h2>
        </div>

        <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30 rounded-full shrink-0">
          Audience State: {audienceReaction}
        </Badge>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-black/10 space-y-4">
        <label className="text-xs text-slate-500 font-bold uppercase">Presentation Pitch Prompt</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-surface-900 border border-black/10 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-black/10 text-center space-y-6">
        <div className="font-mono text-3xl font-extrabold text-slate-900">
          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
        </div>

        <div className="bg-slate-100 p-4 rounded-xl border border-black/5 min-h-[100px] text-left text-xs font-mono text-cyan-600">
          {transcript || 'Deliver your presentation speech...'}
        </div>

        {!isRecording ? (
          <Button size="lg" onClick={handleStart} className="px-8 py-3.5 h-auto rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400">
            Start Speech
          </Button>
        ) : (
          <Button size="lg" onClick={handleStop} className="px-8 py-3.5 h-auto rounded-xl bg-rose-500 text-white font-bold animate-pulse">
            Finish Speech & Evaluate
          </Button>
        )}
      </div>
    </div>
  );
};
