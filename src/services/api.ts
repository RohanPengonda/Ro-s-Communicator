import type { UserProfile, DailyActivity, MonthlyReport, StoryBankItem, Session } from '../types';

const API_BASE = 'http://localhost:3001/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${url}`, options);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API] Failed to fetch ${url}, falling back:`, err);
    return null;
  }
}

export const api = {
  async getProfile(): Promise<UserProfile> {
    const data = await fetchJson<UserProfile>('/profile');
    if (data) return data;
    
    // Default fallback profile
    return {
      name: 'Rohan',
      currentOverallScore: 7.6,
      startingScore: 5.4,
      strongestSkill: 'Explaining Technical Ideas',
      biggestImprovement: 'Storytelling Hooks',
      currentWeakness: 'Memorable Openings',
      recurringPattern: 'Over-explaining context before creating curiosity',
      naturalStrength: 'Vivid Analogies',
      developingSkill: 'Spontaneous Wit',
      currentFocus: 'Audience Engagement & Hooks',
      recommendedNextStep: 'Practice 30-second high-curiosity openings',
      streakDays: 18,
      totalSessions: 47,
      totalPracticeMinutes: 872,
      totalStoriesPracticed: 31,
      practiceConsistencyPct: 86
    };
  },

  async getDailyActivity(): Promise<DailyActivity[]> {
    const data = await fetchJson<DailyActivity[]>('/analytics/daily-activity');
    if (data) return data;

    // Generate fallback daily activity for 90 days
    const fallback: DailyActivity[] = [];
    const today = new Date('2026-09-27');
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isStreak = i <= 18;
      if (isStreak || i % 2 === 0) {
        fallback.push({
          date: dateStr,
          minutesPracticed: Math.floor(Math.random() * 15) + 8,
          sessionsCount: 1,
          exercisesCount: 2,
          dailyScore: parseFloat((6.5 + (90 - i) * 0.015).toFixed(1)),
          bestMoment: 'High curiosity hook',
          focusArea: 'Reduce filler words'
        });
      }
    }
    return fallback;
  },

  async getMonthlyReports(): Promise<MonthlyReport[]> {
    const data = await fetchJson<MonthlyReport[]>('/analytics/monthly-reports');
    if (data) return data;

    return [
      {
        yearMonth: '2026-05',
        monthName: 'May 2026',
        overallScore: 5.4,
        scoreChange: 0.0,
        categoryScores: [
          { category: 'Storytelling', score: 4.8, change: 0.0 },
          { category: 'Clarity', score: 6.2, change: 0.0 },
          { category: 'Wit', score: 3.8, change: 0.0 },
          { category: 'Engagement', score: 4.7, change: 0.0 },
          { category: 'Confidence', score: 5.2, change: 0.0 }
        ],
        biggestImprovement: 'Technical clarity',
        biggestWeakness: 'Rambling setups',
        recurringHabit: 'Starting with low energy',
        nextMonthFocus: 'Conciseness & Structure'
      },
      {
        yearMonth: '2026-06',
        monthName: 'June 2026',
        overallScore: 6.1,
        scoreChange: 0.7,
        categoryScores: [
          { category: 'Storytelling', score: 5.5, change: 0.7 },
          { category: 'Clarity', score: 6.8, change: 0.6 },
          { category: 'Wit', score: 4.3, change: 0.5 },
          { category: 'Engagement', score: 5.6, change: 0.9 },
          { category: 'Confidence', score: 5.9, change: 0.7 }
        ],
        biggestImprovement: 'Reducing filler words',
        biggestWeakness: 'Weak story conflicts',
        recurringHabit: 'Over-explaining technical details',
        nextMonthFocus: 'Storytelling Tension'
      },
      {
        yearMonth: '2026-07',
        monthName: 'July 2026',
        overallScore: 6.8,
        scoreChange: 0.7,
        categoryScores: [
          { category: 'Storytelling', score: 6.4, change: 0.9 },
          { category: 'Clarity', score: 7.2, change: 0.4 },
          { category: 'Wit', score: 4.9, change: 0.6 },
          { category: 'Engagement', score: 6.5, change: 0.9 },
          { category: 'Confidence', score: 6.5, change: 0.6 }
        ],
        biggestImprovement: 'Creating emotional tension',
        biggestWeakness: 'Monotone pitch',
        recurringHabit: 'Apologetic phrasing',
        nextMonthFocus: 'Audience Adaptation'
      },
      {
        yearMonth: '2026-08',
        monthName: 'August 2026',
        overallScore: 7.2,
        scoreChange: 0.4,
        categoryScores: [
          { category: 'Storytelling', score: 7.0, change: 0.6 },
          { category: 'Clarity', score: 7.7, change: 0.5 },
          { category: 'Wit', score: 5.5, change: 0.6 },
          { category: 'Engagement', score: 7.1, change: 0.6 },
          { category: 'Confidence', score: 7.0, change: 0.5 }
        ],
        biggestImprovement: 'Vivid analogies',
        biggestWeakness: 'Slow start to answers',
        recurringHabit: 'Dropping energy at endings',
        nextMonthFocus: 'Spontaneous Responses'
      },
      {
        yearMonth: '2026-09',
        monthName: 'September 2026',
        overallScore: 7.6,
        scoreChange: 0.4,
        categoryScores: [
          { category: 'Storytelling', score: 7.6, change: 0.6 },
          { category: 'Clarity', score: 8.1, change: 0.4 },
          { category: 'Wit', score: 6.2, change: 0.7 },
          { category: 'Engagement', score: 7.8, change: 0.7 },
          { category: 'Confidence', score: 7.5, change: 0.5 }
        ],
        biggestImprovement: 'High-curiosity openings',
        biggestWeakness: 'Delayed punchlines',
        recurringHabit: 'Rushing during Q&A',
        nextMonthFocus: 'Natural Wit & Audience Engagement'
      }
    ];
  },

  async getStories(): Promise<StoryBankItem[]> {
    const data = await fetchJson<StoryBankItem[]>('/stories');
    if (data) return data;

    return [
      {
        id: 'story-1',
        title: 'The 3 AM Production Outage',
        rawVersion: 'I was working on a deployment late at night and ran a script that dropped the secondary cache database. I panicked, but called the lead architect, rolled back the migration, and restored from snapshot within 22 minutes.',
        polishedVersion: 'At 3:14 AM on a Tuesday, my monitor flashed bright red. A rogue cache flush script I executed knocked out session storage for 40,000 active users. Instead of trying to cover it up, I immediately paged the team, initiated snapshot restoration, and brought the service back online in 22 minutes. That night taught me that leadership in technical crises isn’t about perfection—it’s about radical transparency.',
        coreConflict: 'Accidentally taking down secondary cache storage for 40,000 active users during a solo midnight release.',
        turningPoint: 'Deciding to immediately page the senior lead instead of attempting a quiet solo fix.',
        lesson: 'Transparency and rapid calm communication outperform panic fixing every time.',
        themes: ['Crisis Management', 'Technical Failure', 'Ownership', 'Accountability'],
        emotions: ['Panic', 'Calm', 'Relief', 'Pride'],
        interviewUseCases: [
          'Tell me about a time you made a mistake.',
          'How do you perform under intense pressure?',
          'Describe a time you had to handle a critical outage.'
        ],
        practiceCount: 8,
        lastPracticedAt: '2026-09-26'
      },
      {
        id: 'story-2',
        title: 'Explaining RAG to a Skeptical CFO',
        rawVersion: 'Our CFO thought AI was an expensive gimmick. I brought a laptop into her office, uploaded our 300-page SEC filing, and showed her how the AI answered complex financial audit questions in 2 seconds with exact page citations.',
        polishedVersion: 'Our CFO looked at our AI proposal and said: "I am not spending $50k on a chatbot that hallucinates math." So instead of giving a 20-slide PowerPoint deck, I sat next to her, dragged our 400-page tax compliance filing into our prototype, and asked: "What was our non-operating expenditure variance in Q3?" Two seconds later, it gave the exact line item with a hyperlink to page 142. Her jaw dropped. That’s when I realized: don’t explain value—demonstrate proof in their world.',
        coreConflict: 'Overcoming deep executive skepticism regarding corporate AI budget allocation.',
        turningPoint: 'Replacing a slide presentation with a 5-second live file interrogation.',
        lesson: 'Show, don’t tell. Interactive proof beats 20 slides of abstract theory.',
        themes: ['Persuasion', 'Executive Communication', 'AI Adoption', 'Demonstration'],
        emotions: ['Skepticism', 'Astonishment', 'Conviction'],
        interviewUseCases: [
          'How do you convince stakeholders who disagree with you?',
          'Describe how you communicate complex tech to non-technical executives.',
          'Tell me about a successful project proposal.'
        ],
        practiceCount: 5,
        lastPracticedAt: '2026-09-24'
      }
    ];
  },

  async saveStory(story: Partial<StoryBankItem>): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>('/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story)
    });
    return !!res?.success;
  },

  async getSessions(): Promise<Session[]> {
    const data = await fetchJson<Session[]>('/sessions');
    if (data) return data;

    return [];
  },

  async saveSession(session: Session): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>('/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    return !!res?.success;
  },

  async deleteSession(sessionId: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`/sessions/${sessionId}`, {
      method: 'DELETE'
    });
    return !!res?.success;
  }
};
