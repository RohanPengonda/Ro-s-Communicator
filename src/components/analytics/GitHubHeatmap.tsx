import React, { useState } from 'react';
import type { DailyActivity } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Calendar, Flame, Clock, Award, CheckCircle2, TrendingUp } from 'lucide-react';

interface HeatmapProps {
  activities: DailyActivity[];
  streakDays: number;
}

export const GitHubHeatmap: React.FC<HeatmapProps> = ({ activities, streakDays }) => {
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);

  // Map dates to activity map
  const activityMap = new Map<string, DailyActivity>();
  activities.forEach((act) => activityMap.set(act.date, act));

  // Generate past 160 days array ending today
  const days: { dateStr: string; activity?: DailyActivity }[] = [];
  const today = new Date('2026-09-27');

  for (let i = 153; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const act = activityMap.get(dateStr);
    days.push({ dateStr, activity: act });
  }

  // Get color intensity class based on practice minutes & score
  const getIntensityClass = (act?: DailyActivity) => {
    if (!act || act.minutesPracticed === 0) return 'bg-slate-100/60 hover:border-white/30';
    if (act.minutesPracticed < 10) return 'bg-emerald-950/80 border-emerald-800/40 hover:scale-125';
    if (act.minutesPracticed < 20) return 'bg-emerald-700/80 border-emerald-600/50 hover:scale-125';
    if (act.minutesPracticed < 30) return 'bg-emerald-500 border-emerald-400 hover:scale-125';
    return 'bg-gradient-to-tr from-emerald-400 to-cyan-400 border-cyan-300 shadow-lg shadow-emerald-500/30 hover:scale-125';
  };

  const totalMinutes = activities.reduce((acc, a) => acc + a.minutesPracticed, 0);
  const avgScore = activities.length > 0 
    ? (activities.reduce((acc, a) => acc + a.dailyScore, 0) / activities.length).toFixed(1) 
    : '7.4';

  return (
    <Card className="p-6 rounded-2xl border-black/10 relative overflow-hidden gap-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-600" />
            <h3 className="text-lg font-bold text-slate-900">Daily Communication Practice Heatmap</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking daily consistency & evidence-based communication improvement over time.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface-900/60 p-2.5 rounded-xl border border-black/5 text-xs">
          <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-500/20">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-slate-600">Streak:</span>
            <span className="font-bold text-slate-900">{streakDays} Days</span>
          </Badge>

          <Badge variant="outline" className="gap-1.5 text-violet-600 border-emerald-500/20">
            <Clock className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-slate-600">Total:</span>
            <span className="font-bold text-slate-900">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
          </Badge>

          <Badge variant="outline" className="gap-1.5 text-cyan-600 border-cyan-500/20">
            <Award className="w-3.5 h-3.5 text-cyan-600" />
            <span className="text-slate-600">Avg Score:</span>
            <span className="font-bold text-violet-600">{avgScore} / 10</span>
          </Badge>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <TooltipProvider>
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[700px]">
            {days.map((d) => {
              const cellButton = (
                <button
                  onClick={() => d.activity && setSelectedActivity(d.activity)}
                  className={`w-3.5 h-3.5 rounded-sm border border-black/5 transition-all duration-150 cursor-pointer ${getIntensityClass(d.activity)}`}
                />
              );
              if (!d.activity) return <span key={d.dateStr}>{cellButton}</span>;
              return (
                <Tooltip key={d.dateStr}>
                  <TooltipTrigger render={cellButton} />
                  <TooltipContent className="text-white">
                    {d.dateStr}: {d.activity.minutesPracticed} mins ({d.activity.dailyScore}/10)
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Intensity Legend */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-black/5">
        <span>Click any active block to view daily practice report</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-100 border border-black/5" />
          <div className="w-3 h-3 rounded-sm bg-emerald-950 border border-emerald-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700 border border-emerald-600" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400" />
          <div className="w-3 h-3 rounded-sm bg-gradient-to-tr from-emerald-400 to-cyan-400" />
          <span>More</span>
        </div>
      </div>

      {/* Selected Day Details Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogTrigger className="hidden" />
        <DialogContent className="max-w-md rounded-2xl">
          {selectedActivity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-violet-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-slate-900">{selectedActivity.date}</DialogTitle>
                    <DialogDescription className="text-xs text-violet-600 font-semibold">
                      Daily Practice Log
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-900/80 p-3 rounded-xl border border-black/5">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Time Practiced</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedActivity.minutesPracticed} mins</p>
                </div>
                <div className="bg-surface-900/80 p-3 rounded-xl border border-black/5">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Daily Score</span>
                  <p className="text-lg font-bold text-violet-600 mt-0.5">{selectedActivity.dailyScore} / 10</p>
                </div>
                <div className="bg-surface-900/80 p-3 rounded-xl border border-black/5">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Sessions</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedActivity.sessionsCount} sessions</p>
                </div>
                <div className="bg-surface-900/80 p-3 rounded-xl border border-black/5">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Exercises</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedActivity.exercisesCount} completed</p>
                </div>
              </div>

              <Separator className="bg-black/10" />

              <div className="space-y-2 text-xs">
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-violet-600 font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-violet-600" />
                    Best Moment of the Day
                  </div>
                  <p className="text-slate-700">{selectedActivity.bestMoment}</p>
                </div>

                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-amber-600 font-semibold mb-1">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    Focus Area
                  </div>
                  <p className="text-slate-700">{selectedActivity.focusArea}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </Card>
  );
};