import React, { useState } from 'react';
import type { DailyActivity } from '../../types';
import { Calendar, Flame, Award, Clock, CheckCircle2, X } from 'lucide-react';

interface HeatmapProps {
  activities: DailyActivity[];
  streakDays: number;
}

export const GitHubHeatmap: React.FC<HeatmapProps> = ({ activities, streakDays }) => {
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);

  // Map dates to activity map
  const activityMap = new Map<string, DailyActivity>();
  activities.forEach((act) => activityMap.set(act.date, act));

  // Generate past 160 days array (or 52 weeks) ending today
  const days: { dateStr: string; dayOfWeek: number; activity?: DailyActivity }[] = [];
  const today = new Date('2026-09-27');

  for (let i = 153; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 is Sun
    const act = activityMap.get(dateStr);
    days.push({ dateStr, dayOfWeek, activity: act });
  }

  // Get color intensity class based on practice minutes & score
  const getIntensityClass = (act?: DailyActivity) => {
    if (!act || act.minutesPracticed === 0) return 'bg-slate-900/60 border-white/5 hover:border-white/20';
    if (act.minutesPracticed < 10) return 'bg-emerald-950/80 border-emerald-800/40 text-emerald-400 hover:scale-125';
    if (act.minutesPracticed < 20) return 'bg-emerald-700/80 border-emerald-600/50 text-emerald-300 hover:scale-125';
    if (act.minutesPracticed < 30) return 'bg-emerald-500 border-emerald-400 text-surface-950 font-bold hover:scale-125';
    return 'bg-gradient-to-tr from-emerald-400 to-cyan-400 border-cyan-300 text-surface-950 font-extrabold shadow-lg shadow-emerald-500/30 hover:scale-125';
  };

  const totalMinutes = activities.reduce((acc, a) => acc + a.minutesPracticed, 0);
  const avgScore = activities.length > 0 
    ? (activities.reduce((acc, a) => acc + a.dailyScore, 0) / activities.length).toFixed(1) 
    : '7.4';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Daily Communication Practice Heatmap</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking daily consistency & evidence-based communication improvement over time.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-surface-900/60 p-2.5 rounded-xl border border-white/5 text-xs">
          <div className="flex items-center space-x-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-slate-300">Streak:</span>
            <span className="font-bold text-white">{streakDays} Days</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Total:</span>
            <span className="font-bold text-white">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">Avg Score:</span>
            <span className="font-bold text-emerald-400">{avgScore} / 10</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[700px]">
          {days.map((d) => (
            <button
              key={d.dateStr}
              onClick={() => d.activity && setSelectedActivity(d.activity)}
              title={`${d.dateStr}: ${d.activity ? `${d.activity.minutesPracticed} mins (${d.activity.dailyScore}/10)` : 'No practice'}`}
              className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 cursor-pointer ${getIntensityClass(d.activity)}`}
            />
          ))}
        </div>
      </div>

      {/* Intensity Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-white/5">
        <span>Click any active block to view daily practice report</span>
        <div className="flex items-center space-x-2">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-900 border border-white/5" />
          <div className="w-3 h-3 rounded-sm bg-emerald-950 border border-emerald-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700 border border-emerald-600" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400" />
          <div className="w-3 h-3 rounded-sm bg-gradient-to-tr from-emerald-400 to-cyan-400" />
          <span>More</span>
        </div>
      </div>

      {/* Selected Day Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{selectedActivity.date}</h4>
                <p className="text-xs text-emerald-400 font-semibold">Daily Practice Log</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Time Practiced</span>
                <p className="text-lg font-bold text-white mt-0.5">{selectedActivity.minutesPracticed} mins</p>
              </div>
              <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Daily Score</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">{selectedActivity.dailyScore} / 10</p>
              </div>
              <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Sessions</span>
                <p className="text-lg font-bold text-white mt-0.5">{selectedActivity.sessionsCount} sessions</p>
              </div>
              <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Exercises</span>
                <p className="text-lg font-bold text-white mt-0.5">{selectedActivity.exercisesCount} completed</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-1.5 text-emerald-300 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Best Moment of the Day</span>
                </div>
                <p className="text-slate-200">{selectedActivity.bestMoment}</p>
              </div>

              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center space-x-1.5 text-amber-300 font-semibold mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Focus Area</span>
                </div>
                <p className="text-slate-200">{selectedActivity.focusArea}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedActivity(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-500 text-surface-950 font-bold text-sm shadow-md hover:bg-emerald-400 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
