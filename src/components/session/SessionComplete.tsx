import React from 'react';
import type { Session } from '../../types';
import { SessionReplayPlayer } from './SessionReplayPlayer';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Target, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface SessionCompleteProps {
  session: Session;
  onRetry: () => void;
  onDone: () => void;
}

export const SessionComplete: React.FC<SessionCompleteProps> = ({ session, onRetry, onDone }) => {
  const m = session.metrics;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Top Banner Card */}
      <div className="glass-card-accent p-6 lg:p-8 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Session Complete — {session.modeLabel}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Communication Audit & Analysis
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Context: "{session.contextPrompt}"
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center space-x-4 bg-surface-900/90 p-4 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Overall Score</span>
            <span className="text-4xl font-black text-emerald-400 mt-0.5">{session.score.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-normal"> / 10</span>
          </div>
        </div>
      </div>

      {/* Attempt 1 vs Attempt 2 Comparison Banner (If Deltas Exist) */}
      {session.deltas && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-300 font-extrabold text-base">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Attempt 1 vs Attempt 2 — Immediate Proof of Growth</span>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30">
              Attempt #{session.attemptNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Hook Strength</span>
              <span className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +{session.deltas.hookStrengthChangePct}%
              </span>
            </div>

            <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Clarity</span>
              <span className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +{session.deltas.clarityChangePct}%
              </span>
            </div>

            <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Filler Words</span>
              <span className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 mr-0.5 text-emerald-400" /> -{session.deltas.fillerReductionPct}%
              </span>
            </div>

            <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Emotional Detail</span>
              <span className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +{session.deltas.emotionalDetailChangePct}%
              </span>
            </div>

            <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Ending Impact</span>
              <span className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +{session.deltas.endingImpactChangePct}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* One Thing To Practice Highlight */}
      <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 p-5 rounded-2xl border border-emerald-500/40 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-300 font-extrabold text-sm uppercase tracking-wider">
          <Target className="w-5 h-5 text-emerald-400" />
          <span>One Single Thing to Practice Right Now</span>
        </div>
        <p className="text-base text-white font-bold pl-7">
          "{session.oneThingToPractice}"
        </p>
      </div>

      {/* Highlights: You Did Well vs Work On */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* You Did Well */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>What You Did Well</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            <li className="flex items-start space-x-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              <span className="text-emerald-400 font-bold">🔥</span>
              <span><strong>Opening Curiosity:</strong> Stated the stakes cleanly without excessive setup rambling.</span>
            </li>
            <li className="flex items-start space-x-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              <span className="text-emerald-400 font-bold">🔥</span>
              <span><strong>Clarity & Pace:</strong> Maintained a steady speaking rhythm of {m.speakingPaceWPM} WPM.</span>
            </li>
          </ul>
        </div>

        {/* Work On */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Areas to Refine</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            <li className="flex items-start space-x-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <span className="text-amber-400 font-bold">⚠️</span>
              <span><strong>Filler Word Count:</strong> {m.fillerWordsCount} filler words detected ("um", "basically").</span>
            </li>
            <li className="flex items-start space-x-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <span className="text-amber-400 font-bold">⚠️</span>
              <span><strong>Turning Point Delay:</strong> Build conflict earlier before revealing the resolution.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Replay Timeline Component */}
      <SessionReplayPlayer
        durationSeconds={session.durationSeconds}
        replays={session.replays}
      />

      {/* Why-Based Coaching Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-5 h-5" />
          <span>Why-Based Coaching Insights (First-Principles Teaching)</span>
        </div>
        <p className="text-xs text-slate-400">
          We don't just give rewrites—we teach the underlying communication principle so you think like a master speaker.
        </p>

        <div className="space-y-4 pt-2">
          {session.whyCoaching.map((card) => (
            <div key={card.id} className="bg-surface-900/90 border border-white/10 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {card.category} PRINCIPLE
                </span>
              </div>

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
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar: Retry Button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={onDone}
          className="px-6 py-3 rounded-xl bg-surface-900 text-slate-300 text-sm font-bold hover:bg-white/5"
        >
          Return to Dashboard
        </button>

        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition-all transform active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Retry Attempt #{session.attemptNumber + 1} & Compare</span>
        </button>
      </div>

    </div>
  );
};
