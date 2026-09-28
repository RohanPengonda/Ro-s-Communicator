import React, { useState } from 'react';
import type { TrainingMode, Session } from '../../types';
import { LiveCoachMode } from './LiveCoachMode';
import { StorytellingMode } from './StorytellingMode';
import { PublicSpeakingMode } from './PublicSpeakingMode';
import { InterviewMode } from './InterviewMode';
import { SpontaneousChallengeMode } from './SpontaneousChallengeMode';
import { ExplainSimplyMode } from './ExplainSimplyMode';
import { ConversationMode } from './ConversationMode';
import { DailyWorkoutMode } from './DailyWorkoutMode';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Video, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Award, 
  Zap, 
  HelpCircle, 
  Flame, 
  ArrowLeft,
  ArrowUpRight
} from 'lucide-react';

interface ModesHubProps {
  onSessionComplete: (session: Session) => void;
  activeMode?: TrainingMode | 'WORKOUT' | null;
  onClearActiveMode: () => void;
  previousAttemptSession?: Session | null;
  sessions?: Session[];
}

const MODES_GRID: { id: TrainingMode | 'WORKOUT'; title: string; desc: string; icon: typeof Video; tag: string }[] = [
  {
    id: 'LIVE_COACH',
    title: 'Live Coach Mode',
    desc: 'Camera & mic enabled. AI observes pace, filler words, and visual framing with subtle guidance.',
    icon: Video,
    tag: 'A'
  },
  {
    id: 'CONVERSATION',
    title: 'Conversation Mode',
    desc: 'AI behaves like a real human partner. Multi-turn dialogue followed by deep communication analysis.',
    icon: MessageSquare,
    tag: 'B'
  },
  {
    id: 'STORYTELLING',
    title: 'Storytelling Mode',
    desc: '90-second storytelling challenges. Hook, conflict, stakes, and resolution scoring + retry comparison.',
    icon: BookOpen,
    tag: 'C'
  },
  {
    id: 'PUBLIC_SPEAKING',
    title: 'Public Speaking Mode',
    desc: 'Topic pitch with time limit. Evaluates audience pacing, vocal variation, confidence, and transitions.',
    icon: Users,
    tag: 'D'
  },
  {
    id: 'INTERVIEW',
    title: 'Interview Simulator',
    desc: 'HR, technical, and behavioral simulation with follow-up probing questions.',
    icon: Award,
    tag: 'E'
  },
  {
    id: 'SPONTANEOUS',
    title: 'Spontaneous Agility',
    desc: 'Rapid-fire unexpected questions with 5-second preparation countdowns.',
    icon: Zap,
    tag: 'F'
  },
  {
    id: 'EXPLAIN_SIMPLY',
    title: 'Explain-It-Simply',
    desc: 'Technical concept translation trainer for target audiences (10-year-old, non-tech CEO).',
    icon: HelpCircle,
    tag: 'G'
  },
  {
    id: 'WORKOUT',
    title: 'Daily 8-Min Workout',
    desc: 'Curated daily sequence: Story hook, concept translation, spontaneous question, & weakness repeat.',
    icon: Flame,
    tag: 'H'
  }
];

export const ModesHub: React.FC<ModesHubProps> = ({
  onSessionComplete,
  activeMode,
  onClearActiveMode,
  previousAttemptSession
}) => {
  const [selectedMode, setSelectedMode] = useState<TrainingMode | 'WORKOUT' | null>(activeMode || null);

  const handleSelect = (mode: TrainingMode | 'WORKOUT') => {
    setSelectedMode(mode);
  };

  const handleBack = () => {
    setSelectedMode(null);
    onClearActiveMode();
  };

  // Render specific selected mode
  if (selectedMode) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Practice Modes Grid
        </Button>

        {selectedMode === 'LIVE_COACH' && (
          <LiveCoachMode onSessionComplete={onSessionComplete} previousAttemptSession={previousAttemptSession} />
        )}
        {selectedMode === 'STORYTELLING' && (
          <StorytellingMode onSessionComplete={onSessionComplete} previousAttemptSession={previousAttemptSession} />
        )}
        {selectedMode === 'PUBLIC_SPEAKING' && (
          <PublicSpeakingMode onSessionComplete={onSessionComplete} />
        )}
        {selectedMode === 'INTERVIEW' && (
          <InterviewMode onSessionComplete={onSessionComplete} />
        )}
        {selectedMode === 'SPONTANEOUS' && (
          <SpontaneousChallengeMode onSessionComplete={onSessionComplete} />
        )}
        {selectedMode === 'EXPLAIN_SIMPLY' && (
          <ExplainSimplyMode onSessionComplete={onSessionComplete} />
        )}
        {selectedMode === 'CONVERSATION' && (
          <ConversationMode onSessionComplete={onSessionComplete} />
        )}
        {selectedMode === 'WORKOUT' && (
          <DailyWorkoutMode onSessionComplete={onSessionComplete} onWorkoutComplete={() => handleBack()} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card-accent p-6 rounded-2xl border border-emerald-500/30">
        <Badge className="mb-3 bg-emerald-500/15 text-emerald-300 border-emerald-500/30 rounded-full gap-1.5">
          <Video className="w-3.5 h-3.5" />
          8 Specialized Training Environments
        </Badge>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white">Interactive Training Modes</h2>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Choose a specialized training environment tailored to your immediate communication objective.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODES_GRID.map((m) => {
          const IconComponent = m.icon;
          return (
            <Card
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className="glass-panel glass-panel-hover cursor-pointer flex flex-col justify-between gap-4 rounded-2xl p-5 border-white/10"
            >
              <CardContent className="flex flex-1 flex-col gap-3 p-0">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-slate-400 border-white/10">
                    {m.tag}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-white text-base">{m.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
                </div>
              </CardContent>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Start Practice</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};