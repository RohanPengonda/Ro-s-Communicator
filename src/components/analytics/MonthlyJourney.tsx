import React, { useState } from 'react';
import type { MonthlyReport } from '../../types';
import { TrendingUp, ArrowUpRight, CheckCircle2, AlertTriangle, Sparkles, Target } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface MonthlyJourneyProps {
  reports: MonthlyReport[];
}

export const MonthlyJourney: React.FC<MonthlyJourneyProps> = ({ reports }) => {
  const [selectedMonth, setSelectedMonth] = useState<MonthlyReport>(reports[reports.length - 1] || reports[0]);

  const chartData = reports.map((r) => ({
    name: r.monthName.split(' ')[0],
    score: r.overallScore,
    storytelling: r.categoryScores.find((c) => c.category === 'Storytelling')?.score || 5.0,
    clarity: r.categoryScores.find((c) => c.category === 'Clarity')?.score || 6.0,
  }));

  const latest = reports[reports.length - 1];
  const earliest = reports[0];
  const totalGrowth = (latest && earliest) ? (latest.overallScore - earliest.overallScore).toFixed(1) : '2.2';

  return (
    <div className="space-y-6">
      
      {/* Header Summary Banner */}
      <div className="glass-card-accent p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Monthly Communication Journey</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-1">
            + {totalGrowth} Points Long-Term Transformation
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Evidence-based progression derived from historical training sessions. See how your storytelling hooks, conciseness, clarity, and spontaneous wit evolved month over month.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-surface-900/80 p-4 rounded-xl border border-white/10 shrink-0">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Current Level</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">
              {latest?.overallScore.toFixed(1)} <span className="text-sm text-slate-400 font-normal">/ 10</span>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Starting Level</span>
            <div className="text-2xl font-bold text-slate-400 mt-0.5">
              {earliest?.overallScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Overall Score Trajectory (Months 1 - 5+)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="storyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis domain={[4, 10]} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} 
                itemStyle={{ color: '#34d399' }}
              />
              <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" name="Overall Score" />
              <Area type="monotone" dataKey="storytelling" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#storyGrad)" name="Storytelling Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month Selection Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {reports.map((r) => (
          <button
            key={r.yearMonth}
            onClick={() => setSelectedMonth(r)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedMonth.yearMonth === r.yearMonth
                ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-105'
                : 'bg-surface-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xs uppercase font-semibold text-slate-400 block">{r.monthName}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-white">{r.overallScore.toFixed(1)}</span>
              {r.scoreChange > 0 && (
                <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{r.scoreChange}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Month Deep Diagnostic Report */}
      {selectedMonth && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-white">{selectedMonth.monthName} Report</h3>
              <p className="text-xs text-slate-400">Detailed communication audit for {selectedMonth.monthName}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-lg">
              {selectedMonth.overallScore.toFixed(1)} / 10
            </div>
          </div>

          {/* Category Scores Grid */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Skill Category Progression</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {selectedMonth.categoryScores.map((cat) => (
                <div key={cat.category} className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-slate-400 block">{cat.category}</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-bold text-white">{cat.score.toFixed(1)}</span>
                    {cat.change > 0 && (
                      <span className="text-[11px] font-semibold text-emerald-400">+{cat.change}</span>
                    )}
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full" 
                      style={{ width: `${(cat.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Biggest Improvement</span>
              </div>
              <p className="text-slate-200 text-sm font-medium">{selectedMonth.biggestImprovement}</p>
            </div>

            <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Biggest Remaining Weakness</span>
              </div>
              <p className="text-slate-200 text-sm font-medium">{selectedMonth.biggestWeakness}</p>
            </div>

            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Recurring Habit Identified</span>
              </div>
              <p className="text-slate-200 text-sm font-medium">{selectedMonth.recurringHabit}</p>
            </div>

            <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/20">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-1">
                <Target className="w-4 h-4" />
                <span>Focus for Next Month</span>
              </div>
              <p className="text-slate-200 text-sm font-medium">{selectedMonth.nextMonthFocus}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
