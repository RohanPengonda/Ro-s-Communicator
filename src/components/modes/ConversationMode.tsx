import React, { useState } from 'react';
import type { Session, Utterance, TrainingMode } from '../../types';
import { evaluateSession } from '../../services/aiCoachService';
import { MessageSquare, Send } from 'lucide-react';

interface Props {
  onSessionComplete: (session: Session) => void;
}

export const ConversationMode: React.FC<Props> = ({ onSessionComplete }) => {
  const [utterances, setUtterances] = useState<Utterance[]>([
    {
      id: 'u-0',
      speaker: 'AI',
      timestamp: '00:00',
      text: "Hey Rohan! What interesting technical or personal project have you been working on lately?"
    }
  ]);

  const [currentText, setCurrentText] = useState('');

  const handleSendSpeech = async () => {
    if (!currentText.trim()) return;

    const userUtterance: Utterance = {
      id: `u-${Date.now()}`,
      speaker: 'USER',
      timestamp: new Date().toISOString(),
      text: currentText
    };

    const newHistory = [...utterances, userUtterance];
    setUtterances(newHistory);
    setCurrentText('');

    // Generate AI conversational response
    setTimeout(() => {
      const aiReplies = [
        "That sounds fascinating! How did you handle the initial trade-offs between speed and system complexity?",
        "Interesting approach! What was the hardest moment when trying to persuade the team?",
        "Great takeaway! If you had to explain that core lesson in one sentence, what would it be?"
      ];
      const aiUtterance: Utterance = {
        id: `u-${Date.now() + 1}`,
        speaker: 'AI',
        timestamp: new Date().toISOString(),
        text: aiReplies[Math.floor(Math.random() * aiReplies.length)]
      };
      setUtterances([...newHistory, aiUtterance]);
    }, 800);
  };

  const handleFinishConversation = async () => {
    const fullTranscript = utterances.map((u) => `${u.speaker}: ${u.text}`).join('\n');

    const evalResult = await evaluateSession({
      mode: 'CONVERSATION' as TrainingMode,
      contextPrompt: 'Natural Multi-Turn Conversational Roleplay',
      transcript: fullTranscript,
      durationSeconds: 45
    });

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: 'CONVERSATION',
      modeLabel: 'Conversation Simulator Mode',
      durationSeconds: 45,
      contextPrompt: 'Multi-Turn Roleplay',
      transcript: fullTranscript,
      score: evalResult.score,
      utterances,
      metrics: evalResult.metrics,
      replays: evalResult.replays,
      whyCoaching: evalResult.whyCoaching,
      attemptNumber: 1,
      oneThingToPractice: evalResult.oneThingToPractice
    };

    onSessionComplete(newSession);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase">
            <MessageSquare className="w-4 h-4" />
            <span>Mode B — Conversation Mode</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Natural Conversational Flow Partner</h2>
        </div>

        <button
          onClick={handleFinishConversation}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-surface-950 font-bold text-xs hover:bg-emerald-400"
        >
          End & Get Analysis
        </button>
      </div>

      {/* Utterances Chat View */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 min-h-[350px] max-h-[450px] overflow-y-auto">
        {utterances.map((u) => (
          <div
            key={u.id}
            className={`flex ${u.speaker === 'USER' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed ${
                u.speaker === 'USER'
                  ? 'bg-emerald-500 text-surface-950 font-medium rounded-br-none shadow-md'
                  : 'bg-surface-900 border border-white/10 text-white rounded-bl-none'
              }`}
            >
              <span className="text-[10px] font-bold opacity-60 block uppercase mb-0.5">
                {u.speaker === 'USER' ? 'You' : 'AI Partner'}
              </span>
              {u.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type or speak your conversational response..."
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendSpeech()}
          className="flex-1 bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleSendSpeech}
          className="p-3.5 rounded-xl bg-emerald-500 text-surface-950 font-bold hover:bg-emerald-400"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
