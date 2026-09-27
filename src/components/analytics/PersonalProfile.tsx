import React from 'react';
import type { UserProfile } from '../../types';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
}

export const PersonalProfile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner / User Hero */}
      <div className="glass-panel p-6 lg:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/20">
              <div className="w-full h-full bg-surface-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-emerald-400">
                {profile.name[0]}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white">{profile.name}'s Communication Model</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  Level: Advanced Communicator
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Evolving personal model based on {profile.totalSessions} live practice sessions & {profile.totalStoriesPracticed} stories.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-surface-900/80 p-3 rounded-2xl border border-white/10">
            <div className="px-4 py-2 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Current Ability</span>
              <span className="text-2xl font-extrabold text-emerald-400">{profile.currentOverallScore.toFixed(1)} / 10</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="px-4 py-2 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Consistency</span>
              <span className="text-2xl font-extrabold text-cyan-400">{profile.practiceConsistencyPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Evidence Dashboard */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-4">
          <ShieldCheck className="w-5 h-5" />
          <span>Evidence-Based Confidence Dashboard</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-900/80 p-4 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Training Time</span>
            </div>
            <p className="text-2xl font-extrabold text-white mt-1">
              {Math.floor(profile.totalPracticeMinutes / 60)}h {profile.totalPracticeMinutes % 60}m
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Across {profile.totalSessions} sessions</span>
          </div>

          <div className="bg-surface-900/80 p-4 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Stories Practiced</span>
            </div>
            <p className="text-2xl font-extrabold text-white mt-1">{profile.totalStoriesPracticed}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">In personal Story Bank</span>
          </div>

          <div className="bg-surface-900/80 p-4 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Score Gain</span>
            </div>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              +{(profile.currentOverallScore - profile.startingScore).toFixed(1)} Pts
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">From {profile.startingScore} start</span>
          </div>

          <div className="bg-surface-900/80 p-4 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Current Streak</span>
            </div>
            <p className="text-2xl font-extrabold text-white mt-1">{profile.streakDays} Days</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Consecutive daily workouts</span>
          </div>
        </div>

        {/* Evidence Quote */}
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Evidence Note:</strong> "You have practiced {profile.streakDays} days consecutively and completed {profile.totalSessions} sessions. Your storytelling score has improved from {profile.startingScore} to {profile.currentOverallScore}. Confidence here is built on verified performance evidence, not generic praise."
          </p>
        </div>
      </div>

      {/* Evolving Communication Traits Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths & Assets */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Verified Communication Strengths</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Strongest Skill</span>
              <p className="text-sm font-bold text-emerald-300 mt-0.5">{profile.strongestSkill}</p>
            </div>

            <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Natural Strength</span>
              <p className="text-sm font-bold text-white mt-0.5">{profile.naturalStrength}</p>
            </div>

            <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Developing Skill</span>
              <p className="text-sm font-bold text-cyan-300 mt-0.5">{profile.developingSkill}</p>
            </div>
          </div>
        </div>

        {/* Weaknesses & Patterns */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Areas of Discomfort & Patterns</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Current Primary Weakness</span>
              <p className="text-sm font-bold text-rose-300 mt-0.5">{profile.currentWeakness}</p>
            </div>

            <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Recurring Speech Pattern</span>
              <p className="text-sm font-medium text-amber-200 mt-0.5">{profile.recurringPattern}</p>
            </div>

            <div className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Recommended Next Step</span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">{profile.recommendedNextStep}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
