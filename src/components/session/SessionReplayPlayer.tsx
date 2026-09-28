import React, { useState } from 'react';
import type { SessionReplayMarker } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Separator } from '../ui/separator';
import { Play, Pause, Clock } from 'lucide-react';

interface ReplayPlayerProps {
  durationSeconds: number;
  replays: SessionReplayMarker[];
}

const MARKER_STYLES: Record<SessionReplayMarker['type'], string> = {
  STRONG_OPENING: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  FILLER_SPIKE: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
  LOST_CLARITY: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  EXCELLENT_ANALOGY: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  MISSED_WIT: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  STRONG_ENDING: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
};

export const SessionReplayPlayer: React.FC<ReplayPlayerProps> = ({
  durationSeconds,
  replays
}) => {
  const [activeMarker, setActiveMarker] = useState<SessionReplayMarker | null>(replays[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 rounded-2xl border-white/10 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Interactive Session Replay Timeline</h3>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">Synchronized Transcript & Coaching Markers</span>
      </div>

      <CardContent className="p-0 flex flex-col gap-4">
        {/* Timeline Scrubber */}
        <div className="relative bg-surface-900/90 border border-white/10 rounded-xl p-4 space-y-4">
          {/* Marker Pins & Slider */}
          <div className="relative">
            <Slider
              value={[currentTime]}
              min={0}
              max={Math.max(1, durationSeconds)}
              step={1}
              onValueChange={(val) => {
                const next = Array.isArray(val) ? (val[0] ?? 0) : val;
                setCurrentTime(next);
                const nearest = [...replays]
                  .sort((a, b) => Math.abs(a.timestampSeconds - next) - Math.abs(b.timestampSeconds - next))[0];
                if (nearest && Math.abs(nearest.timestampSeconds - next) <= 3) {
                  setActiveMarker(nearest);
                }
              }}
            />

            {/* Coaching marker pins */}
            {replays.map((m) => {
              const pct = Math.min(95, Math.max(2, (m.timestampSeconds / durationSeconds) * 100));
              const isSelected = activeMarker?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveMarker(m);
                    setCurrentTime(m.timestampSeconds);
                    setIsPlaying(false);
                  }}
                  style={{ left: `${pct}%` }}
                  title={`${m.label} (${formatTime(m.timestampSeconds)})`}
                  className={`absolute -top-1 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'scale-110 z-20 shadow-lg shadow-emerald-500/40 bg-emerald-400 text-surface-950 border-white'
                      : MARKER_STYLES[m.type] ?? 'bg-slate-800 border-white/10 text-slate-300'
                  }`}
                >
                  {formatTime(m.timestampSeconds)}
                </button>
              );
            })}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  if (!isPlaying && currentTime >= durationSeconds) setCurrentTime(0);
                  setIsPlaying(!isPlaying);
                }}
                className="bg-emerald-500 text-surface-950 font-bold hover:bg-emerald-400 hover:text-surface-950 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-surface-950" />}
              </Button>
              <span className="font-mono text-white font-bold">{formatTime(currentTime)} / {formatTime(durationSeconds)}</span>
            </div>
            <span className="hidden sm:inline">Click markers on timeline to jump to coaching notes</span>
          </div>
        </div>

        {/* Selected Marker Detail Card */}
        {activeMarker && (
          <>
            <Separator className="bg-white/10" />
            <div className="bg-surface-900/90 border border-white/10 p-4 rounded-xl space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge className={`rounded-full ${MARKER_STYLES[activeMarker.type] ?? 'bg-slate-800 border-white/10 text-slate-300'}`}>
                    {activeMarker.label}
                  </Badge>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};