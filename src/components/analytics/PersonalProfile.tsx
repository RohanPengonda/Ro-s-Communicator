import React from 'react';
import type { UserProfile } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarBadge } from '../ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Progress, ProgressIndicator } from '../ui/progress';
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
  const kpis = [
    {
      label: 'Training Time',
      icon: Clock,
      color: 'text-emerald-400',
      value: `${Math.floor(profile.totalPracticeMinutes / 60)}h ${profile.totalPracticeMinutes % 60}m`,
      sub: `Across ${profile.totalSessions} sessions`
    },
    {
      label: 'Stories Practiced',
      icon: BookOpen,
      color: 'text-cyan-400',
      value: `${profile.totalStoriesPracticed}`,
      sub: 'In personal Story Bank'
    },
    {
      label: 'Score Gain',
      icon: TrendingUp,
      color: 'text-amber-400',
      value: `+${(profile.currentOverallScore - profile.startingScore).toFixed(1)} Pts`,
      sub: `From ${profile.startingScore} start`
    },
    {
      label: 'Current Streak',
      icon: Flame,
      color: 'text-rose-400',
      value: `${profile.streakDays} Days`,
      sub: 'Consecutive daily workouts'
    }
  ];

  const strengths = [
    { label: 'Strongest Skill', value: profile.strongestSkill, color: 'text-emerald-300' },
    { label: 'Natural Strength', value: profile.naturalStrength, color: 'text-white' },
    { label: 'Developing Skill', value: profile.developingSkill, color: 'text-cyan-300' },
  ];

  const weaknesses = [
    { label: 'Current Primary Weakness', value: profile.currentWeakness, color: 'text-rose-300' },
    { label: 'Recurring Speech Pattern', value: profile.recurringPattern, color: 'text-amber-200' },
    { label: 'Recommended Next Step', value: profile.recommendedNextStep, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / User Hero */}
      <Card className="p-6 lg:p-8 rounded-2xl border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="size-16 rounded-2xl">
              <AvatarFallback className="bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-surface-950 text-2xl font-black rounded-2xl">
                {profile.name[0]}
              </AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white">{profile.name}'s Communication Model</h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full">
                  Level: Advanced Communicator
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Evolving personal model based on {profile.totalSessions} live practice sessions & {profile.totalStoriesPracticed} stories.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface-900/80 p-3 rounded-2xl border border-white/10">
            <div className="px-4 py-2 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Current Ability</span>
              <span className="text-2xl font-extrabold text-emerald-400">{profile.currentOverallScore.toFixed(1)} / 10</span>
            </div>
            <Separator orientation="vertical" className="h-8 bg-white/10" />
            <div className="px-4 py-2 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Consistency</span>
              <span className="text-2xl font-extrabold text-cyan-400">{profile.practiceConsistencyPct}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Confidence Evidence Dashboard */}
      <Card className="p-6 rounded-2xl border-white/10 gap-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" />
          <span>Evidence-Based Confidence Dashboard</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const IconComponent = kpi.icon;
            return (
              <div key={kpi.label} className="bg-surface-900/80 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                  <IconComponent className={`w-4 h-4 ${kpi.color}`} />
                  <span>{kpi.label}</span>
                </div>
                <p className="text-2xl font-extrabold text-white mt-1">{kpi.value}</p>
                <span className="text-[11px] text-slate-400 mt-1 block">{kpi.sub}</span>
              </div>
            );
          })}
        </div>

        {/* Consistency Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Practice Consistency</span>
            <span className="font-bold text-cyan-400">{profile.practiceConsistencyPct}%</span>
          </div>
          <Progress value={profile.practiceConsistencyPct}>
            <ProgressIndicator className="bg-cyan-400" />
          </Progress>
        </div>

        {/* Evidence Quote */}
        <Alert className="bg-emerald-500/10 border-emerald-500/20 p-4 text-xs text-slate-300 gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-emerald-400 shrink-0" />
          <AlertTitle className="text-white text-sm">Evidence Note</AlertTitle>
          <AlertDescription className="leading-relaxed">
            "You have practiced {profile.streakDays} days consecutively and completed {profile.totalSessions} sessions. Your storytelling score has improved from {profile.startingScore} to {profile.currentOverallScore}. Confidence here is built on verified performance evidence, not generic praise."
          </AlertDescription>
        </Alert>
      </Card>

      {/* Evolving Communication Traits Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths & Assets */}
        <Card className="p-6 rounded-2xl border-white/10 gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Verified Communication Strengths</span>
          </h3>

          <div className="space-y-3">
            {strengths.map((item) => (
              <div key={item.label} className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
                <span className="text-xs font-semibold text-slate-400 uppercase">{item.label}</span>
                <p className={`text-sm font-bold mt-0.5 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Weaknesses & Patterns */}
        <Card className="p-6 rounded-2xl border-white/10 gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Areas of Discomfort & Patterns</span>
          </h3>

          <div className="space-y-3">
            {weaknesses.map((item) => (
              <div key={item.label} className="bg-surface-900/80 p-3.5 rounded-xl border border-white/5">
                <span className="text-xs font-semibold text-slate-400 uppercase">{item.label}</span>
                <p className={`text-sm mt-0.5 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};