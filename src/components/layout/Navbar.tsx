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
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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

const NAV_ITEMS: { key: ActiveTab; label: string; icon: typeof BarChart3 }[] = [
  { key: 'DASHBOARD', label: 'Dashboard', icon: BarChart3 },
  { key: 'MODES', label: 'Practice Modes', icon: Layers },
  { key: 'STORY_BANK', label: 'Story Bank', icon: BookOpen },
  { key: 'HEATMAP', label: 'Heatmap', icon: Flame },
  { key: 'MONTHLY_JOURNEY', label: 'Monthly Progress', icon: TrendingUp },
  { key: 'PROFILE', label: 'Profile', icon: Award },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakDays,
  overallScore,
  onStartWorkout
}) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('DASHBOARD')}
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-surface-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                ANTIGRAVITY
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full">
                AI Coach
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium">Personal AI Communication Agent</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-surface-900/80 p-1 rounded-xl border border-white/5">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;
            return (
              <Button
                key={item.key}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(item.key)}
                className={`gap-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-surface-950 shadow-md font-semibold hover:bg-emerald-500 hover:text-surface-950'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Right Stats & Quick Action */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Streak Badge */}
          <Badge className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border-amber-500/20 text-amber-400 text-sm font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            {streakDays} Days
          </Badge>

          {/* Overall Score Badge */}
          <Badge className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-sm font-bold">
            <Target className="w-4 h-4" />
            {overallScore.toFixed(1)} / 10
          </Badge>

          {/* Today's Workout Button */}
          <Button
            onClick={onStartWorkout}
            className="gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Today's Workout</span>
            <span className="sm:hidden">Workout</span>
          </Button>

        </div>
      </div>
    </header>
  );
};