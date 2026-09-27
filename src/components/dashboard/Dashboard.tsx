import React from 'react';
import type { UserProfile, DailyActivity, TrainingMode } from '../../types';
import { GitHubHeatmap } from '../analytics/GitHubHeatmap';
import { 
  Target, 
  Flame, 
  TrendingUp, 
  Video, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  dailyActivities: DailyActivity[];
  onSelectMode: (mode: TrainingMode | 'WORKOUT') => void;
  onStartWorkout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  dailyActivities,
  onSelectMode,
  onStartWorkout
}) => {
  return (
    <div className="space-y-6">
      
      {/* Hero Header Banner */}
      <div className="glass-card-accent p-6 lg:p-8 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Welcome back, {profile.name}</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-extrabold text-white mt-1">
            Personal AI Communication Agent
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Your long-term storytelling & public speaking mentor. Consistently observing, coaching, measuring, and demonstrating your communication transformation over time.
          </p>
        </div>

        {/* Big Today's Workout CTA */}
        <button
          onClick={onStartWorkout}
          className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-surface-950 font-black text-base shadow-xl shadow-emerald-500/30 transition-all transform active:scale-95 shrink-0 flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-950/20 flex items-center justify-center text-surface-950">
            <Flame className="w-6 h-6 fill-surface-950 animate-bounce" />
          </div>
          <div className="text-left">
            <span className="text-[11px] uppercase tracking-wider font-extrabold block text-surface-950/80">Today's Workout</span>
            <span className="text-lg font-black block">Start 8-Min Workout</span>
          </div>
          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        {/* Overall Communication Score */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Overall Score</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-emerald-400">{profile.currentOverallScore.toFixed(1)}</div>
            <span className="text-[11px] text-slate-400 font-medium">Out of 10.0 scale</span>
          </div>
        </div>

        {/* Monthly Progress Gain */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Monthly Progress</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-cyan-400">+0.8</div>
            <span className="text-[11px] text-emerald-400 font-semibold">↑ Storytelling +18%</span>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-white">{profile.streakDays} Days</div>
            <span className="text-[11px] text-amber-400 font-semibold">Active Consistency</span>
          </div>
        </div>

        {/* Current Primary Focus */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Current Focus</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white leading-snug">{profile.currentFocus}</div>
            <span className="text-[11px] text-slate-400 block mt-1">High curiosity openings</span>
          </div>
        </div>

        {/* Practice Time */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Practice</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-white">
              {Math.floor(profile.totalPracticeMinutes / 60)}h {profile.totalPracticeMinutes % 60}m
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">{profile.totalSessions} Sessions Completed</span>
          </div>
        </div>

      </div>

      {/* GitHub Practice Heatmap Component */}
      <GitHubHeatmap activities={dailyActivities} streakDays={profile.streakDays} />

      {/* Strengths & Weaknesses Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Strongest Communication Skill</span>
            <h4 className="text-base font-extrabold text-white mt-0.5">{profile.strongestSkill}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Your explanation score rises significantly when using vivid analogies and real-world parallels.
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Current Primary Weakness</span>
            <h4 className="text-base font-extrabold text-white mt-0.5">{profile.currentWeakness}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {profile.recurringPattern}. Practice leading with the conclusion first.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch Practice Modes Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white">Quick Practice Modes</h3>
          <span className="text-xs text-slate-400">Select any mode to begin live training</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectMode('LIVE_COACH')}
            className="p-4 rounded-xl bg-surface-900/80 border border-white/5 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-left group"
          >
            <Video className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-white text-sm">Live Coach</h5>
            <span className="text-[11px] text-slate-400">Camera + Audio HUD</span>
          </button>

          <button
            onClick={() => onSelectMode('STORYTELLING')}
            className="p-4 rounded-xl bg-surface-900/80 border border-white/5 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-left group"
          >
            <BookOpen className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-white text-sm">Storytelling</h5>
            <span className="text-[11px] text-slate-400">90s Hook & Tension</span>
          </button>

          <button
            onClick={() => onSelectMode('SPONTANEOUS')}
            className="p-4 rounded-xl bg-surface-900/80 border border-white/5 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-left group"
          >
            <Zap className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-white text-sm">Spontaneous</h5>
            <span className="text-[11px] text-slate-400">Surprise Challenges</span>
          </button>

          <button
            onClick={() => onSelectMode('INTERVIEW')}
            className="p-4 rounded-xl bg-surface-900/80 border border-white/5 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-left group"
          >
            <Award className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-white text-sm">Interview Prep</h5>
            <span className="text-[11px] text-slate-400">HR & Technical Qs</span>
          </button>
        </div>
      </div>

    </div>
  );
};
