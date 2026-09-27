import React, { useState } from 'react';
import type { SessionReplayMarker } from '../../types';
import { Play, Pause, Clock } from 'lucide-react';

interface ReplayPlayerProps {
  durationSeconds: number;
  replays: SessionReplayMarker[];
}

export const SessionReplayPlayer: React.FC<ReplayPlayerProps> = ({
  durationSeconds,
  replays
}) => {
  const [activeMarker, setActiveMarker] = useState<SessionReplayMarker | null>(replays[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const getMarkerBadgeStyle = (type: SessionReplayMarker['type']) => {
    switch (type) {
      case 'STRONG_OPENING':
        return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
      case 'FILLER_SPIKE':
        return 'bg-rose-500/20 border-rose-500/40 text-rose-300';
      case 'EXCELLENT_ANALOGY':
        return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300';
      case 'MISSED_WIT':
        return 'bg-amber-500/20 border-amber-500/40 text-amber-300';
      case 'STRONG_ENDING':
        return 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300';
      default:
        return 'bg-slate-800 border-white/10 text-slate-300';
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Interactive Session Replay Timeline</h3>
        </div>
        <span className="text-xs text-slate-400">Synchronized Transcript & Coaching Markers</span>
      </div>

      {/* Timeline Scrubber Bar */}
      <div className="relative bg-surface-900/90 border border-white/10 rounded-xl p-4 space-y-3">
        
        {/* Visual Marker Pins on Timeline */}
        <div className="relative w-full h-8 bg-slate-950 rounded-lg overflow-hidden flex items-center px-2">
          
          {/* Progress bar background */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 border-r border-emerald-500/50 transition-all"
            style={{ width: `${(currentTime / durationSeconds) * 100}%` }}
          />

          {replays.map((m) => {
            const pct = Math.min(95, Math.max(2, (m.timestampSeconds / durationSeconds) * 100));
            const isSelected = activeMarker?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMarker(m);
                  setCurrentTime(m.timestampSeconds);
                }}
                style={{ left: `${pct}%` }}
                title={`${m.label} (${formatTime(m.timestampSeconds)})`}
                className={`absolute transform -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                  isSelected 
                    ? 'scale-110 z-20 shadow-lg shadow-emerald-500/40 bg-emerald-400 text-surface-950 border-white' 
                    : getMarkerBadgeStyle(m.type)
                }`}
              >
                {formatTime(m.timestampSeconds)}
              </button>
            );
          })}
        </div>

        {/* Playback Controls & Timestamp */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-emerald-500 text-surface-950 font-bold hover:bg-emerald-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-surface-950" />}
            </button>
            <span className="font-mono text-white font-bold">{formatTime(currentTime)} / {formatTime(durationSeconds)}</span>
          </div>

          <span>Click markers on timeline to jump to coaching notes</span>
        </div>
      </div>

      {/* Selected Marker Detail Card */}
      {activeMarker && (
        <div className="bg-surface-900/90 border border-white/10 p-4 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getMarkerBadgeStyle(activeMarker.type)}`}>
                {activeMarker.label}
              </span>
              <span className="text-xs font-mono text-slate-400">Timestamp: {formatTime(activeMarker.timestampSeconds)}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-white/5 font-mono text-xs text-emerald-300">
            "{activeMarker.textSnippet}"
          </div>

          <p className="text-xs text-slate-200 leading-relaxed pt-1">
            <strong className="text-emerald-400">Coach Guidance:</strong> {activeMarker.advice}
          </p>
        </div>
      )}

    </div>
  );
};
