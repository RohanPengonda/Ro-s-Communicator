import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Target, 
  TrendingUp, 
  BookOpen, 
  BarChart3, 
  Layers, 
  Award,
  Video
} from 'lucide-react';

export type ActiveTab = 
  | 'DASHBOARD'
  | 'MODES'
  | 'STORY_BANK'
  | 'HEATMAP'
  | 'MONTHLY_JOURNEY'
  | 'CONFIDENCE'
  | 'PROFILE';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  streakDays: number;
  overallScore: number;
  onStartWorkout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakDays,
  overallScore,
  onStartWorkout
}) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('DASHBOARD')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-surface-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                ANTIGRAVITY
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                AI Coach
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Personal AI Communication Agent</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-surface-900/80 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'DASHBOARD'
                ? 'bg-emerald-500 text-surface-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('MODES')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'MODES'
                ? 'bg-emerald-500 text-surface-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Practice Modes</span>
          </button>

          <button
            onClick={() => setActiveTab('STORY_BANK')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'STORY_BANK'
                ? 'bg-emerald-500 text-surface-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Story Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('HEATMAP')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'HEATMAP'
                ? 'bg-emerald-500 text-surface-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={() => setActiveTab('MONTHLY_JOURNEY')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'MONTHLY_JOURNEY'
                ? 'bg-emerald-500 text-surface-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Monthly Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'PROFILE'
                ? 'bg-emerald-500 text-surface-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>

        {/* Right Stats & Quick Action */}
        <div className="flex items-center space-x-3">
          
          {/* Streak Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakDays} Days</span>
          </div>

          {/* Overall Score Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
            <Target className="w-4 h-4" />
            <span>{overallScore.toFixed(1)} / 10</span>
          </div>

          {/* Today's Workout Button */}
          <button
            onClick={onStartWorkout}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
          >
            <Video className="w-4 h-4" />
            <span>Today's Workout</span>
          </button>

        </div>
      </div>
    </header>
  );
};
