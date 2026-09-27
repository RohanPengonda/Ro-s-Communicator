import React, { useState, useRef } from 'react';
import type { Session, TrainingMode } from '../../types';
import { SpeechTracker } from '../../services/speechService';
import { evaluateSession } from '../../services/aiCoachService';
import { HelpCircle } from 'lucide-react';

interface Props {
  onSessionComplete: (session: Session) => void;
}

const AUDIENCES = [
  { label: '10-Year-Old Child', prompt: 'Explain Retrieval-Augmented Generation (RAG) to a 10-year-old using a school library analogy.' },
  { label: 'Non-Technical CFO', prompt: 'Explain technical debt to a CFO focused on quarterly EBITDA targets.' },
  { label: 'Non-Tech CEO', prompt: 'Explain cloud architecture migration to a CEO who cares only about speed to market.' }
];

export const ExplainSimplyMode: React.FC<Props> = ({ onSessionComplete }) => {
  const [selectedAudience, setSelectedAudience] = useState(AUDIENCES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);

  const trackerRef = useRef<SpeechTracker | null>(null);
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

    trackerRef.current = tracker;
    await tracker.start();

    timerRef.current = setInterval(() => setTimerSeconds((p) => p + 1), 1000);
  };

  const handleStop = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (trackerRef.current) trackerRef.current.stop();

    const finalTranscript = transcript || "Imagine asking a library helper to open a 500-page book to page 12 and hand you the exact sentence.";

    const evalResult = await evaluateSession({
      mode: 'EXPLAIN_SIMPLY' as TrainingMode,
      contextPrompt: selectedAudience.prompt,
      targetAudience: selectedAudience.label,
      transcript: finalTranscript,
      durationSeconds: Math.max(10, timerSeconds)
    });

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: 'EXPLAIN_SIMPLY',
      modeLabel: 'Explain-It-Simply Mode',
      durationSeconds: Math.max(10, timerSeconds),
      contextPrompt: selectedAudience.prompt,
      targetAudience: selectedAudience.label,
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
      <div className="glass-card-accent p-6 rounded-2xl border border-emerald-500/30">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase">
          <HelpCircle className="w-4 h-4" />
          <span>Mode G — Audience Adaptation Trainer</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">Explain Complex Ideas Simply</h2>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <span className="text-xs text-slate-400 font-bold uppercase">Select Target Audience Level</span>
        <div className="space-y-2">
          {AUDIENCES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAudience(item)}
              className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${
                selectedAudience.label === item.label ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-surface-900 border-white/5 text-slate-300'
              }`}
            >
              <span className="text-xs text-emerald-400 uppercase font-bold block mb-1">{item.label}</span>
              "{item.prompt}"
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-6">
        <div className="font-mono text-3xl font-extrabold text-white">
          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/5 min-h-[100px] text-left text-xs font-mono text-emerald-300">
          {transcript || 'Explain the concept using a vivid simple analogy...'}
        </div>

        {!isRecording ? (
          <button onClick={handleStart} className="px-8 py-3.5 rounded-xl bg-emerald-500 text-surface-950 font-bold hover:bg-emerald-400">
            Start Explanation
          </button>
        ) : (
          <button onClick={handleStop} className="px-8 py-3.5 rounded-xl bg-rose-500 text-white font-bold animate-pulse">
            Submit & Evaluate
          </button>
        )}
      </div>
    </div>
  );
};
