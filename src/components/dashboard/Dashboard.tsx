import React from 'react';
import type { UserProfile, DailyActivity, TrainingMode } from '../../types';
import { GitHubHeatmap } from '../analytics/GitHubHeatmap';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { 
  Target, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Video
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  dailyActivities: DailyActivity[];
  onSelectMode: (mode: TrainingMode | 'WORKOUT') => void;
  onStartWorkout: () => void;
}

const QUICK_MODES: { mode: TrainingMode; title: string; subtitle: string; icon: typeof Video }[] = [
  { mode: 'LIVE_COACH', title: 'Live Coach', subtitle: 'Camera + Audio HUD', icon: Video },
  { mode: 'STORYTELLING', title: 'Storytelling', subtitle: '90s Hook & Tension', icon: BookOpen },
  { mode: 'SPONTANEOUS', title: 'Spontaneous', subtitle: 'Surprise Challenges', icon: Zap },
  { mode: 'INTERVIEW', title: 'Interview Prep', subtitle: 'HR & Technical Qs', icon: Award },
];

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
          <Badge className="mb-3 bg-emerald-500/15 text-violet-600 border-emerald-500/30 rounded-full gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome back, {profile.name}
          </Badge>
          <h1 className="text-2xl lg:text-4xl font-extrabold text-slate-900">
            Personal AI Communication Agent
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Your long-term storytelling & public speaking mentor. Consistently observing, coaching, measuring, and demonstrating your communication transformation over time.
          </p>
        </div>

        {/* Big Today's Workout CTA */}
        <Button
          onClick={onStartWorkout}
          size="lg"
className="rounded-2xl h-auto gap-3 px-6 py-5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-white font-black text-base shadow-xl shadow-emerald-500/30 active:scale-95 shrink-0 flex items-center text-left"
          >
          <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center text-white shrink-0">
            <Flame className="w-6 h-6 fill-surface-950 animate-bounce" />
          </div>
          <span className="flex flex-col text-left">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/90">Today's Workout</span>
            <span className="text-lg font-black">Start 8-Min Workout</span>
          </span>
          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="bg-surface-900/60 border-black/10">
          <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Overall Score</span>
              <Target className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-violet-600">{profile.currentOverallScore.toFixed(1)}</div>
              <span className="text-[11px] text-slate-500 font-medium">Out of 10.0 scale</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-black/10">
          <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Monthly Progress</span>
              <TrendingUp className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-cyan-600">+0.8</div>
              <span className="text-[11px] text-violet-600 font-semibold">↑ Storytelling +18%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-black/10">
          <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Daily Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{profile.streakDays} Days</div>
              <span className="text-[11px] text-amber-600 font-semibold">Active Consistency</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-black/10">
          <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Current Focus</span>
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-snug">{profile.currentFocus}</div>
              <span className="text-[11px] text-slate-500 block mt-1">High curiosity openings</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-black/10 col-span-2 sm:col-span-1">
          <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Total Practice</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {Math.floor(profile.totalPracticeMinutes / 60)}h {profile.totalPracticeMinutes % 60}m
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">{profile.totalSessions} Sessions Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GitHub Practice Heatmap Component */}
      <GitHubHeatmap activities={dailyActivities} streakDays={profile.streakDays} />

      {/* Strengths & Weaknesses Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className="bg-surface-900/60 border-emerald-500/20 gap-3 p-5 rounded-2xl">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-violet-600" />
          <AlertTitle className="text-base font-extrabold text-slate-900">
            {profile.strongestSkill}
          </AlertTitle>
          <AlertDescription className="text-xs text-slate-600">
            Your explanation score rises significantly when using vivid analogies and real-world parallels.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive" className="bg-surface-900/60 p-5 rounded-2xl">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600" />
          <AlertTitle className="text-base font-extrabold text-slate-900">
            {profile.currentWeakness}
          </AlertTitle>
          <AlertDescription className="text-xs text-slate-600">
            {profile.recurringPattern}. Practice leading with the conclusion first.
          </AlertDescription>
        </Alert>
      </div>

      {/* Quick Launch Practice Modes Grid */}
      <Card className="bg-surface-900/60 border-black/10 p-6 gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">Quick Practice Modes</h3>
          <span className="text-xs text-slate-500">Select any mode to begin live training</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_MODES.map((m) => {
            const IconComponent = m.icon;
            return (
              <Button
                key={m.mode}
                variant="outline"
                onClick={() => onSelectMode(m.mode)}
                className="h-auto flex-col items-start gap-3 p-4 rounded-xl bg-surface-900/80 border-black/5 hover:border-emerald-500/50 hover:bg-black/5"
              >
                <IconComponent className="w-5 h-5 text-violet-600" />
                <span className="flex flex-col items-start gap-0.5">
                  <span className="font-bold text-slate-900 text-sm">{m.title}</span>
                  <span className="text-[11px] text-slate-500 font-normal">{m.subtitle}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </Card>

    </div>
  );
};