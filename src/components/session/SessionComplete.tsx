import React from 'react';
import type { Session } from '../../types';
import { SessionReplayPlayer } from './SessionReplayPlayer';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Target, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb
} from 'lucide-react';

interface SessionCompleteProps {
  session: Session;
  onRetry: () => void;
  onDone: () => void;
}

export const SessionComplete: React.FC<SessionCompleteProps> = ({ session, onRetry, onDone }) => {
  const m = session.metrics;

  const deltas = session.deltas
    ? [
        { label: 'Hook Strength', value: `+${session.deltas.hookStrengthChangePct}%`, good: true },
        { label: 'Clarity', value: `+${session.deltas.clarityChangePct}%`, good: true },
        { label: 'Filler Words', value: `-${session.deltas.fillerReductionPct}%`, good: true },
        { label: 'Emotional Detail', value: `+${session.deltas.emotionalDetailChangePct}%`, good: true },
        { label: 'Ending Impact', value: `+${session.deltas.endingImpactChangePct}%`, good: true },
      ]
    : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Top Banner Card */}
      <div className="glass-card-accent p-6 lg:p-8 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="mb-3 bg-emerald-500/15 text-emerald-300 border-emerald-500/30 rounded-full gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Session Complete — {session.modeLabel}
          </Badge>
          <h1 className="text-3xl font-extrabold text-white">
            Communication Audit & Analysis
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Context: "{session.contextPrompt}"
          </p>
        </div>

        {/* Overall Score */}
        <div className="flex items-center gap-3 bg-surface-900/90 p-4 rounded-2xl border border-white/10 shrink-0">
          <Target className="w-6 h-6 text-emerald-400" />
          <div className="text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Overall Score</span>
            <span className="text-4xl font-black text-emerald-400 leading-none">{session.score.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-normal"> / 10</span>
          </div>
        </div>
      </div>

      {/* Attempt Comparison (If Deltas Exist) */}
      {session.deltas && (
        <Card className="p-6 rounded-2xl border-cyan-500/40 bg-cyan-950/20 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-base">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Attempt 1 vs Attempt 2 — Immediate Proof of Growth</span>
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 rounded-full">
              Attempt #{session.attemptNumber}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {deltas.map((d) => (
              <div key={d.label} className="bg-surface-900/80 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">{d.label}</span>
                <span className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center justify-center">
                  {d.good ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />} {d.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* One Thing To Practice Highlight */}
      <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 p-5 rounded-2xl border border-emerald-500/40 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-emerald-300 font-extrabold text-sm uppercase tracking-wider block">One Single Thing to Practice Right Now</span>
          <p className="text-base text-white font-bold mt-0.5">"{session.oneThingToPractice}"</p>
        </div>
      </div>

      {/* Highlights: You Did Well vs Work On */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 rounded-2xl border-white/10 gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            What You Did Well
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            <li className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Opening Curiosity:</strong> Stated the stakes cleanly without excessive setup rambling.</span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Clarity & Pace:</strong> Maintained a steady speaking rhythm of {m.speakingPaceWPM} WPM.</span>
            </li>
          </ul>
        </Card>

        <Card className="p-5 rounded-2xl border-white/10 gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Areas to Refine
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            <li className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <span className="text-amber-400 font-bold">⚠</span>
              <span><strong>Filler Word Count:</strong> {m.fillerWordsCount} filler words detected ("um", "basically").</span>
            </li>
            <li className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <span className="text-amber-400 font-bold">⚠</span>
              <span><strong>Turning Point Delay:</strong> Build conflict earlier before revealing the resolution.</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Replay Timeline Component */}
      <SessionReplayPlayer
        durationSeconds={session.durationSeconds}
        replays={session.replays}
      />

      {/* Why-Based Coaching Cards */}
      <Card className="p-6 rounded-2xl border-white/10 gap-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-5 h-5" />
          <span>Why-Based Coaching Insights (First-Principles Teaching)</span>
        </div>
        <p className="text-xs text-slate-400">
          We don't just give rewrites—we teach the underlying communication principle so you think like a master speaker.
        </p>

        <div className="space-y-4 pt-2">
          {session.whyCoaching.map((card) => (
            <Card key={card.id} className="p-5 rounded-xl border-white/10 gap-3">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 rounded-full">
                {card.category} PRINCIPLE
              </Badge>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">Observation & Impact</span>
                  <p className="text-slate-200 mt-1">{card.observation}</p>
                  <p className="text-rose-300/90 mt-1 font-medium">{card.impact}</p>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                  <span className="text-[11px] text-emerald-400 font-semibold uppercase block">Underlying Principle</span>
                  <p className="text-emerald-200 mt-1 font-medium">{card.principle}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                <span className="text-[11px] text-amber-400 font-semibold uppercase block mb-1">Exemplar Reframing</span>
                <p className="text-xs font-mono text-amber-200">{card.exemplarReframing}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Separator className="bg-white/10" />

      {/* Action Bar */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-1">
        <Button variant="outline" onClick={onDone} className="gap-2 rounded-xl text-slate-300">
          Return to Dashboard
        </Button>

        <Button
          onClick={onRetry}
          className="gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          Retry Attempt #{session.attemptNumber + 1} & Compare
        </Button>
      </div>

    </div>
  );
};