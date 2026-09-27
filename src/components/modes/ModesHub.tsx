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
  Sparkles
} from 'lucide-react';

interface ModesHubProps {
  onSessionComplete: (session: Session) => void;
  activeMode?: TrainingMode | 'WORKOUT' | null;
  onClearActiveMode: () => void;
  previousAttemptSession?: Session | null;
  sessions?: Session[];
}

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
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold bg-surface-900 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Practice Modes Grid</span>
        </button>

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

  // Render Modes Grid
  const MODES_GRID = [
    {
      id: 'LIVE_COACH' as TrainingMode,
      title: 'A. Live Coach Mode',
      desc: 'Camera & mic enabled. AI observes pace, filler words, and visual framing with subtle guidance.',
      icon: Video,
      accent: 'emerald'
    },
    {
      id: 'CONVERSATION' as TrainingMode,
      title: 'B. Conversation Mode',
      desc: 'AI behaves like a real human partner. Multi-turn dialogue followed by deep communication analysis.',
      icon: MessageSquare,
      accent: 'indigo'
    },
    {
      id: 'STORYTELLING' as TrainingMode,
      title: 'C. Storytelling Mode',
      desc: '90-second storytelling challenges. Hook, conflict, stakes, and resolution scoring + retry comparison.',
      icon: BookOpen,
      accent: 'cyan'
    },
    {
      id: 'PUBLIC_SPEAKING' as TrainingMode,
      title: 'D. Public Speaking Mode',
      desc: 'Topic pitch with time limit. Evaluates audience pacing, vocal variation, confidence, and transitions.',
      icon: Users,
      accent: 'amber'
    },
    {
      id: 'INTERVIEW' as TrainingMode,
      title: 'E. Interview Simulator',
      desc: 'HR, technical, and behavioral simulation with follow-up probing questions.',
      icon: Award,
      accent: 'emerald'
    },
    {
      id: 'SPONTANEOUS' as TrainingMode,
      title: 'F. Spontaneous Agility',
      desc: 'Rapid-fire unexpected questions with 5-second preparation countdowns.',
      icon: Zap,
      accent: 'amber'
    },
    {
      id: 'EXPLAIN_SIMPLY' as TrainingMode,
      title: 'G. Explain-It-Simply',
      desc: 'Technical concept translation trainer for target audiences (10-year-old, non-tech CEO).',
      icon: HelpCircle,
      accent: 'cyan'
    },
    {
      id: 'WORKOUT' as const,
      title: 'H. Daily 8-Min Workout',
      desc: 'Curated daily sequence: Story hook, concept translation, spontaneous question, & weakness repeat.',
      icon: Flame,
      accent: 'emerald'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card-accent p-6 rounded-2xl border border-emerald-500/30">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-white">Interactive Training Modes</h2>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Choose a specialized training environment tailored to your immediate communication objective.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODES_GRID.map((m) => {
          const IconComponent = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base">{m.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{m.desc}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Start Practice</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
