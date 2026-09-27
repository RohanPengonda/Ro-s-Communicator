import React, { useState, useEffect } from 'react';
import type { 
  UserProfile, 
  DailyActivity, 
  MonthlyReport, 
  StoryBankItem, 
  Session, 
  TrainingMode 
} from './types';
import { api } from './services/api';

// Layout & Views
import { Navbar } from './components/layout/Navbar';
import type { ActiveTab } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ModesHub } from './components/modes/ModesHub';
import { SessionComplete } from './components/session/SessionComplete';
import { GitHubHeatmap } from './components/analytics/GitHubHeatmap';
import { MonthlyJourney } from './components/analytics/MonthlyJourney';
import { PersonalProfile } from './components/analytics/PersonalProfile';
import { StoryBank } from './components/storybank/StoryBank';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
  
  // Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [stories, setStories] = useState<StoryBankItem[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  
  // Active Interactive Session State
  const [activeCompletedSession, setActiveCompletedSession] = useState<Session | null>(null);
  const [activePracticeMode, setActivePracticeMode] = useState<TrainingMode | 'WORKOUT' | null>(null);
  const [previousAttemptSession, setPreviousAttemptSession] = useState<Session | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      const [pData, dData, mData, sData, sessData] = await Promise.all([
        api.getProfile(),
        api.getDailyActivity(),
        api.getMonthlyReports(),
        api.getStories(),
        api.getSessions()
      ]);

      setProfile(pData);
      setDailyActivities(dData);
      setMonthlyReports(mData);
      setStories(sData);
      setSessions(sessData);
    }
    loadInitialData();
  }, []);

  // Handler when a session finishes
  const handleSessionComplete = async (newSession: Session) => {
    await api.saveSession(newSession);
    setActiveCompletedSession(newSession);
    
    // Refresh list
    const updatedSessions = await api.getSessions();
    setSessions(updatedSessions);
    const updatedProfile = await api.getProfile();
    setProfile(updatedProfile);
  };

  // Handler for Retry Attempt
  const handleRetryAttempt = () => {
    if (activeCompletedSession) {
      setPreviousAttemptSession(activeCompletedSession);
      setActivePracticeMode(activeCompletedSession.mode);
      setActiveCompletedSession(null);
      setActiveTab('MODES');
    }
  };

  // Handler when starting story from Story Bank
  const handlePracticeStoryFromBank = (_story: StoryBankItem) => {
    setActivePracticeMode('STORYTELLING');
    setActiveTab('MODES');
  };

  // Handler when story saved
  const handleSaveStory = async (story: Partial<StoryBankItem>) => {
    await api.saveStory(story);
    const updated = await api.getStories();
    setStories(updated);
    return true;
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-spin">
            💎
          </div>
          <p className="text-sm text-slate-400 font-bold">Loading Personal AI Communication Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveCompletedSession(null);
        }}
        streakDays={profile.streakDays}
        overallScore={profile.currentOverallScore}
        onStartWorkout={() => {
          setActivePracticeMode('WORKOUT');
          setActiveCompletedSession(null);
          setActiveTab('MODES');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Render Session Complete Screen if active */}
        {activeCompletedSession ? (
          <SessionComplete
            session={activeCompletedSession}
            onRetry={handleRetryAttempt}
            onDone={() => {
              setActiveCompletedSession(null);
              setActiveTab('DASHBOARD');
            }}
          />
        ) : (
          <>
            {activeTab === 'DASHBOARD' && (
              <Dashboard
                profile={profile}
                dailyActivities={dailyActivities}
                onSelectMode={(mode) => {
                  setActivePracticeMode(mode);
                  setActiveTab('MODES');
                }}
                onStartWorkout={() => {
                  setActivePracticeMode('WORKOUT');
                  setActiveTab('MODES');
                }}
              />
            )}

            {activeTab === 'MODES' && (
              <ModesHub
                activeMode={activePracticeMode}
                onClearActiveMode={() => setActivePracticeMode(null)}
                onSessionComplete={handleSessionComplete}
                previousAttemptSession={previousAttemptSession}
                sessions={sessions}
              />
            )}

            {activeTab === 'STORY_BANK' && (
              <StoryBank
                stories={stories}
                onSaveStory={handleSaveStory}
                onPracticeStory={handlePracticeStoryFromBank}
              />
            )}

            {activeTab === 'HEATMAP' && (
              <div className="space-y-6">
                <GitHubHeatmap activities={dailyActivities} streakDays={profile.streakDays} />
              </div>
            )}

            {activeTab === 'MONTHLY_JOURNEY' && (
              <MonthlyJourney reports={monthlyReports} />
            )}

            {activeTab === 'PROFILE' && (
              <PersonalProfile profile={profile} />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-400">
        Personal AI Communication Agent — Powered by Gemini 2.5 Flash & Google DeepMind Agentic Coding Framework
      </footer>

    </div>
  );
};

export default App;
