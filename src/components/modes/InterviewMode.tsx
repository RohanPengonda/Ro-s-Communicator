import React, { useState, useRef } from 'react';
import type { Session, TrainingMode } from '../../types';
import { SpeechTracker } from '../../services/speechService';
import { evaluateSession } from '../../services/aiCoachService';
import { Award } from 'lucide-react';

interface Props {
  onSessionComplete: (session: Session) => void;
}

const QUESTIONS = [
  "Why should we hire you over other candidate options?",
  "Tell me about a time you made a major technical mistake under pressure.",
  "How do you handle disagreement with a manager when you know your solution is right?"
];

export const InterviewMode: React.FC<Props> = ({ onSessionComplete }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(QUESTIONS[0]);
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

    const finalTranscript = transcript || "I bring a track record of taking complex technical problems and shipping clear, high-impact products rapidly.";

    const evalResult = await evaluateSession({
      mode: 'INTERVIEW' as TrainingMode,
      contextPrompt: selectedQuestion,
      transcript: finalTranscript,
      durationSeconds: Math.max(10, timerSeconds)
    });

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: 'INTERVIEW',
      modeLabel: 'Interview Simulator',
      durationSeconds: Math.max(10, timerSeconds),
      contextPrompt: selectedQuestion,
      transcript: finalTranscript,
      score: evalResult.score,
      utterances: [
        { id: 'u1', speaker: 'AI', timestamp: '00:00', text: selectedQuestion },
        { id: 'u2', speaker: 'USER', timestamp: '00:04', text: finalTranscript }
      ],
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
          <Award className="w-4 h-4" />
          <span>Mode E — Behavioral & Technical Interview Simulator</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">High-Stakes Interview Practice</h2>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <span className="text-xs text-slate-400 font-bold uppercase">Select Interview Question</span>
        <div className="space-y-2">
          {QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedQuestion(q)}
              className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${
                selectedQuestion === q ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-surface-900 border-white/5 text-slate-300'
              }`}
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-6">
        <div className="font-mono text-3xl font-extrabold text-white">
          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/5 min-h-[100px] text-left text-xs font-mono text-emerald-300">
          {transcript || 'Answer the interview question clearly...'}
        </div>

        {!isRecording ? (
          <button onClick={handleStart} className="px-8 py-3.5 rounded-xl bg-emerald-500 text-surface-950 font-bold hover:bg-emerald-400">
            Start Answer
          </button>
        ) : (
          <button onClick={handleStop} className="px-8 py-3.5 rounded-xl bg-rose-500 text-white font-bold animate-pulse">
            Submit Answer & Evaluate
          </button>
        )}
      </div>
    </div>
  );
};
